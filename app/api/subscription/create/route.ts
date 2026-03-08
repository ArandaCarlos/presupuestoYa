import { NextRequest, NextResponse } from 'next/server'
import { createSubscription } from '@/lib/mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        // Verificar que el usuario existe como profesional
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

        // Crear la suscripción en MercadoPago
        const subscription = await createSubscription({
            payerEmail: user.email!,
            professionalId: professional.id,
            backUrl: `${appUrl}/dashboard/upgrade?status=success`,
        })

        // Guardar el ID de suscripción pendiente
        await supabase
            .from('professionals')
            .update({
                mp_subscription_id: subscription.id,
                subscription_status: 'pending',
            })
            .eq('id', professional.id)

        // Devolver la URL de pago de MercadoPago
        return NextResponse.json({
            init_point: subscription.init_point,
            subscription_id: subscription.id,
        })

    } catch (error: any) {
        console.error('Error creando suscripción:', error)
        return NextResponse.json(
            { error: error.message || 'Error al crear la suscripción' },
            { status: 500 }
        )
    }
}
