import { NextRequest, NextResponse } from 'next/server'
import { getMPClient, mpPaymentStatusToPlan, mpPreapprovalStatusToPlan } from '@/lib/mercadopago'
import { Payment, PreApproval } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
    try {
        // MercadoPago envía notificaciones de dos maneras:
        // 1. Webhooks (Dashboard): body JSON { action: "payment.created", data: { id: "123" } }
        // 2. IPN (notification_url): query params ?topic=payment&id=123

        // Extraer de Query Params (IPN)
        const searchParams = request.nextUrl.searchParams
        const topicParam = searchParams.get('topic') || searchParams.get('type')
        const idParam = searchParams.get('data.id') || searchParams.get('id')
        
        // Extraer de Body (Webhook)
        let body: any = {}
        try {
            body = await request.json()
        } catch(e) { /* body vacío o no JSON */ }

        const type = body?.type || topicParam
        const action = body?.action
        const resourceId = body?.data?.id || idParam

        console.log(`[MP Webhook] Received type=${type}, action=${action}, id=${resourceId}`)

        // 1. Manejar NOTIFICACIONES DE PAGOS ÚNICOS (Preferences)
        if (type === 'payment' || action?.startsWith('payment.') || topicParam === 'payment') {
            if (!resourceId) return NextResponse.json({ error: 'Sin ID de pago' }, { status: 400 })
            return await handlePaymentNotification(resourceId)
        }

        // 2. Manejar NOTIFICACIONES DE SUSCRIPCIONES (Preapprovals)
        if (type === 'preapproval' || action?.startsWith('preapproval.')) {
            if (!resourceId) return NextResponse.json({ error: 'Sin ID de preapproval' }, { status: 400 })
            return await handlePreapprovalNotification(resourceId)
        }

        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error('Error en webhook MP:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

async function handlePaymentNotification(paymentId: string) {
    const client = getMPClient()
    const payment = new Payment(client)

    // Consultamos el estado real del pago para evitar fraudes
    const paymentInfo = await payment.get({ id: paymentId })

    // external_reference tiene el professional.id que enviamos al crear la preference
    const professionalId = paymentInfo.external_reference
    if (!professionalId) {
        console.error('Pago sin external_reference (ID de profesional)')
        return NextResponse.json({ error: 'Missing external_reference' }, { status: 400 })
    }

    const mpStatus = paymentInfo.status || 'pending'
    const { plan, statusDesc } = mpPaymentStatusToPlan(mpStatus)

    // Si el pago está aprobado, le damos 30 días de Pro
    let expiresAt = null
    if (plan === 'pro') {
        const date = new Date()
        date.setDate(date.getDate() + 30)
        expiresAt = date.toISOString()
    }

    // Actualizar el profesional en Supabase
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('professionals')
        .update({
            plan,
            subscription_status: statusDesc,
            subscription_expires_at: expiresAt,
        })
        .eq('id', professionalId)

    if (error) {
        console.error('Error actualizando plan (pago):', error)
        return NextResponse.json({ error: 'Error en BD' }, { status: 500 })
    }

    console.log(`✅ Plan actualizado (Pago Único) a "${plan}" para profesional ${professionalId}`)
    return NextResponse.json({ received: true, plan })
}

async function handlePreapprovalNotification(preapprovalId: string) {
    const client = getMPClient()
    // Nota: El SDK v2 no tiene una clase 'PreApproval' con un método .get igual que Payment
    // pero podemos usar el endpoint directo o esperar que el SDK se comporte igual.
    const preapproval = new PreApproval(client)
    
    // Consultamos la suscripción
    const info = await preapproval.get({ id: preapprovalId })
    
    const professionalId = info.external_reference
    if (!professionalId) {
        console.error('Suscripción sin external_reference')
        return NextResponse.json({ error: 'Missing external_reference' }, { status: 400 })
    }

    const { plan, statusDesc } = mpPreapprovalStatusToPlan(info.status || 'pending')

    // Si está autorizado, le damos el plan Pro
    // Para suscripciones recurrentes, no necesariamente seteamos expires_at fijo, 
    // sino que confiamos en que MP nos avisará si se cancela o falla el cobro.
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('professionals')
        .update({
            plan,
            subscription_status: statusDesc,
            mp_subscription_id: preapprovalId,
            // Podríamos setear un expiresAt preventivo basado en info.next_payment_date
            subscription_expires_at: info.next_payment_date || null
        })
        .eq('id', professionalId)

    if (error) {
        console.error('Error actualizando plan (suscripción):', error)
        return NextResponse.json({ error: 'Error en BD' }, { status: 500 })
    }

    console.log(`✅ Plan actualizado (Suscripción) a "${plan}" para profesional ${professionalId} (Status: ${statusDesc})`)
    return NextResponse.json({ received: true, plan })
}

// MercadoPago necesita poder hacer GET para verificar el endpoint
export async function GET() {
    return NextResponse.json({ status: 'webhook ok' })
}
