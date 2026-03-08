import { NextRequest, NextResponse } from 'next/server'
import { getSubscription, mpStatusToPlan, verifyWebhookSignature } from '@/lib/mercadopago'
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
        const xSignature = request.headers.get('x-signature')
        const xRequestId = request.headers.get('x-request-id')
        const body = await request.json()

        const { type, data } = body

        // Solo procesar eventos de suscripciones (preapproval)
        if (type !== 'subscription_preapproval') {
            return NextResponse.json({ received: true })
        }

        const subscriptionId = data?.id
        if (!subscriptionId) {
            return NextResponse.json({ error: 'Sin ID de suscripción' }, { status: 400 })
        }

        // Verificar firma (opcional en test, obligatorio en producción)
        if (!verifyWebhookSignature(xSignature, xRequestId, subscriptionId)) {
            return NextResponse.json({ error: 'Firma inválida' }, { status: 403 })
        }

        // Obtener estado real de la suscripción desde MP
        const subscription = await getSubscription(subscriptionId)
        const { plan, subscriptionStatus } = mpStatusToPlan(subscription.status || 'pending')

        // Actualizar el profesional en Supabase por mp_subscription_id
        const supabase = getServiceClient()
        const { error } = await supabase
            .from('professionals')
            .update({
                plan,
                subscription_status: subscriptionStatus,
                subscription_expires_at: subscription.next_payment_date
                    ? new Date(subscription.next_payment_date).toISOString()
                    : null,
            })
            .eq('mp_subscription_id', subscriptionId)

        if (error) {
            console.error('Error actualizando plan:', error)
            return NextResponse.json({ error: 'Error en BD' }, { status: 500 })
        }

        console.log(`✅ Plan actualizado a "${plan}" para subscription ${subscriptionId}`)
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
