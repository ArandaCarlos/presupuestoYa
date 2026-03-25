import { NextRequest, NextResponse } from 'next/server'
import { getMPClient } from '@/lib/mercadopago'
import { PreApproval } from 'mercadopago'
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

        // Aunque ya tenga Pro, permitimos re-suscribirse para pruebas si es necesario 
        // o si es la suscripción vieja (Preference) y quiere pasar a recurrente.

        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
        const appUrl = `${protocol}://${host}`

        const client = getMPClient()
        const preApproval = new PreApproval(client)

        const planId = process.env.MERCADOPAGO_PLAN_ID
        if (!planId) {
            throw new Error('MERCADOPAGO_PLAN_ID no configurado')
        }

        const response = await preApproval.create({
            body: {
                preapproval_plan_id: planId,
                payer_email: user.email!,
                back_url: `${appUrl}/dashboard?subscription=success`,
                external_reference: professional.id,
            }
        })

        return NextResponse.json({
            init_point: response.init_point,
            preapproval_id: response.id,
        })

    } catch (error: any) {
        console.error('Error creando suscripción MP:', error)
        return NextResponse.json(
            { error: error.message || 'Error al crear la suscripción' },
            { status: 500 }
        )
    }
}
