import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const supabase = createAdminClient()

        // 1. Obtener los detalles del presupuesto y el profesional
        const { data: quote, error: quoteError } = await supabase
            .from('quotes')
            .select('*, professionals(*)')
            .eq('slug', slug)
            .single()

        if (quoteError || !quote) {
            console.error('Error fetching quote:', quoteError)
            return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 })
        }

        const professional = quote.professionals
        if (!professional || !professional.user_id) {
            return NextResponse.json({ error: 'Profesional no encontrado o sin usuario asociado' }, { status: 404 })
        }

        // 2. Obtener el email del profesional desde Auth
        const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(professional.user_id)

        if (authError || !user || !user.email) {
            console.error('Error fetching professional email:', authError)
            return NextResponse.json({ error: 'No se pudo obtener el email del profesional' }, { status: 500 })
        }

        // 3. Enviar el email con Resend
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
        const quoteUrl = `${appUrl}/p/${quote.slug}`

        const { data, error: resendError } = await resend.emails.send({
            from: DEFAULT_FROM_EMAIL,
            to: [user.email],
            subject: '🎉 Tu presupuesto fue aceptado',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #334155;">
                    <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 16px;">¡Buenas noticias! 🎉</h1>
                    <p style="font-size: 16px; line-height: 1.5;">${quote.client_signature_name || 'Un cliente'} aceptó tu presupuesto.</p>
                    
                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
                        <p style="margin: 0 0 8px 0;"><strong>Trabajo:</strong> ${quote.trade}</p>
                        <p style="margin: 0 0 8px 0;"><strong>Monto:</strong> $${quote.total_amount.toLocaleString('es-AR')}</p>
                        <p style="margin: 0;"><strong>Link al presupuesto:</strong> <a href="${quoteUrl}" style="color: #2563eb; text-decoration: none;">Ver detalles</a></p>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b;">Contactalo para coordinar los siguientes pasos.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">Generado con <strong>PresupuestosYA</strong></p>
                </div>
            `
        })

        if (resendError) {
            console.error('Resend error:', resendError)
            return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 })
        }

        return NextResponse.json({ success: true, id: data?.id })

    } catch (error: any) {
        console.error('Unexpected error in accept-notify:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
