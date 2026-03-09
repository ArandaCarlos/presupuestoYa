import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { data: professional } = await supabase
            .from('professionals')
            .select('id, plan')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!professional) {
            return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
        }

        if (professional.plan === 'pro') {
            return NextResponse.json({ error: 'Ya tenés el plan Pro activo' }, { status: 400 })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
        const planId = process.env.MERCADOPAGO_PLAN_ID

        if (!accessToken || !planId) {
            return NextResponse.json({ error: 'Configuración de MercadoPago incompleta' }, { status: 500 })
        }

        // Llamada directa a la API REST de MercadoPago (sin SDK)
        const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                preapproval_plan_id: planId,
                payer_email: user.email,
                back_url: `${appUrl}/dashboard/upgrade?status=success`,
                external_reference: professional.id,
                reason: 'PresupuestoYA Pro — presupuestos ilimitados',
            }),
        })

        const mpData = await mpResponse.json()

        if (!mpResponse.ok) {
            console.error('Error MercadoPago:', mpData)
            return NextResponse.json(
                { error: mpData.message || JSON.stringify(mpData) },
                { status: mpResponse.status }
            )
        }

        // Guardar el ID de suscripción pendiente
        await supabase
            .from('professionals')
            .update({
                mp_subscription_id: mpData.id,
                subscription_status: 'pending',
            })
            .eq('id', professional.id)

        return NextResponse.json({
            init_point: mpData.init_point,
            subscription_id: mpData.id,
        })

    } catch (error: any) {
        console.error('Error creando suscripción:', error)
        return NextResponse.json(
            { error: error.message || 'Error al crear la suscripción' },
            { status: 500 }
        )
    }
}
