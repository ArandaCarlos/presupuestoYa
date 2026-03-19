import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { quoteId } = await req.json()
        if (!quoteId) return NextResponse.json({ error: 'Falta quoteId' }, { status: 400 })

        const supabase = createAdminClient()

        // 1. Get the quote
        const { data: quote, error: quoteError } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', quoteId)
            .single()

        if (quoteError || !quote) {
            return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 })
        }

        if (quote.status !== 'accepted') {
            return NextResponse.json({ error: 'El presupuesto debe estar aceptado para generar factura' }, { status: 400 })
        }

        // 2. Check if invoice already exists
        const { data: existing } = await supabase
            .from('invoices')
            .select('id')
            .eq('quote_id', quoteId)
            .single()

        if (existing) {
            return NextResponse.json({ invoiceId: existing.id })
        }

        // 3. Insert invoice (snapshot)
        // Public url will be /p/factura/{id} but we need the ID first. We insert without public_url, then we construct it.
        const { data: invoice, error: insertError } = await supabase
            .from('invoices')
            .insert({
                quote_id: quote.id,
                professional_id: quote.professional_id,
                client_name: quote.client_name,
                client_phone: quote.client_phone,
                client_address: quote.address,
                trade: quote.trade,
                description: quote.description,
                client_signature_name: quote.client_signature_name,
                client_signature_data: quote.client_signature_data,
                client_signature_date: quote.client_signature_date,
                materials_amount: quote.materials_amount,
                labor_amount: quote.labor_amount,
                total_amount: quote.total_amount,
                // The URL can be dynamically generated in frontend or stored here:
                // We will leave public_url null or update it if needed. 
                // Alternatively, we just construct public_url in the UI.
            })
            .select()
            .single()

        if (insertError || !invoice) {
            console.error('Error insertando factura:', insertError)
            return NextResponse.json({ error: 'Error generando la factura' }, { status: 500 })
        }

        // 4. Update public_url now that we have the ID
        const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://presupuestoya.com'}/p/factura/${invoice.id}`
        await supabase
            .from('invoices')
            .update({ public_url: publicUrl })
            .eq('id', invoice.id)

        return NextResponse.json({ invoiceId: invoice.id })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
