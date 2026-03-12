import { NextRequest, NextResponse } from 'next/server'
import { getMPClient } from '@/lib/mercadopago'
import { Preference } from 'mercadopago'
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

        // Remover slash final si existe en NEXT_PUBLIC_APP_URL para evitar doble slash
        let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        if (appUrl.endsWith('/')) {
            appUrl = appUrl.slice(0, -1)
        }
        
        // Crear la Preferencia (pago simple) en MercadoPago
        const client = getMPClient()
        const preference = new Preference(client)
        
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'pro_plan',
                        title: 'PresupuestoYA Pro',
                        description: 'Suscripción por 30 días con presupuestos ilimitados',
                        quantity: 1,
                        unit_price: 20, 
                        // Nota: el monto real dependerá de lo que quieras setear, lo bajé a 20 para pruebas
                    }
                ],
                payer: {
                    email: user.email,
                },
                back_urls: {
                    success: `${appUrl}/dashboard/upgrade?status=success`,
                    failure: `${appUrl}/dashboard/upgrade?status=failure`,
                    pending: `${appUrl}/dashboard/upgrade?status=pending`,
                },
                auto_return: 'approved',
                // Clave: enviamos el ID del profesional para idenficarlo en el webhook
                external_reference: professional.id,
            }
        })

        // Obtener el init_point de la respuesta para redirigir al usuario al checkout
        return NextResponse.json({
            init_point: response.init_point,
            preference_id: response.id,
        })

    } catch (error: any) {
        console.error('Error creando preferencia PM:', error)
        return NextResponse.json(
            { error: error.message || 'Error al crear la preferencia de pago' },
            { status: 500 }
        )
    }
}
