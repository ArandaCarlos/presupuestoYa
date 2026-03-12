import { NextRequest, NextResponse } from 'next/server'
import { getMPClient, mpPaymentStatusToPlan } from '@/lib/mercadopago'
import { Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

// Usar service_role para el webhook (no hay sesión de usuario)
function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

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
        const paymentId = body?.data?.id || idParam

        // Solo procesar notificaciones de pagos
        if (type !== 'payment' && !action?.startsWith('payment.') && topicParam !== 'payment') {
            return NextResponse.json({ received: true })
        }

        if (!paymentId) {
            return NextResponse.json({ error: 'Sin ID de pago' }, { status: 400 })
        }

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
        const supabase = getServiceClient()
        const { error } = await supabase
            .from('professionals')
            .update({
                plan,
                subscription_status: statusDesc,
                subscription_expires_at: expiresAt,
            })
            .eq('id', professionalId)

        if (error) {
            console.error('Error actualizando plan:', error)
            return NextResponse.json({ error: 'Error en BD' }, { status: 500 })
        }

        console.log(`✅ Plan actualizado a "${plan}" para profesional ${professionalId} (Pago: ${paymentId})`)
        return NextResponse.json({ received: true, plan })

    } catch (error: any) {
        console.error('Error en webhook MP:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// MercadoPago necesita poder hacer GET para verificar el endpoint
export async function GET() {
    return NextResponse.json({ status: 'webhook ok' })
}
