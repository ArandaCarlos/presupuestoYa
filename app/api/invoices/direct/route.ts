import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface InvoiceItem {
    descripcion: string;
    monto: number;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            client_name,
            client_phone,
            client_address,
            description,
            trade,
            items,
        }: {
            client_name?: string;
            client_phone?: string;
            client_address?: string;
            description?: string;
            trade?: string;
            items: InvoiceItem[];
        } = body;

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Se requiere al menos un ítem' }, { status: 400 });
        }

        const validItems = items.filter(
            (i) => i.descripcion?.trim() && typeof i.monto === 'number' && i.monto > 0
        );
        if (validItems.length === 0) {
            return NextResponse.json(
                { error: 'Cada ítem debe tener descripción y monto mayor a cero' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get professional and check quota
        const { data: professional } = await supabase
            .from('professionals')
            .select('id, plan, monthly_quote_count, quota_reset_at')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!professional) {
            return NextResponse.json(
                { error: 'No se encontró perfil profesional' },
                { status: 404 }
            );
        }

        // Check monthly quota (same logic as quotes)
        const now = new Date();
        const resetAt = professional.quota_reset_at
            ? new Date(professional.quota_reset_at)
            : now;
        const sameMonth =
            now.getMonth() === resetAt.getMonth() &&
            now.getFullYear() === resetAt.getFullYear();
        const currentCount = sameMonth ? professional.monthly_quote_count || 0 : 0;

        if (professional.plan === 'free' && currentCount >= 5) {
            return NextResponse.json(
                { error: 'Límite de documentos alcanzado para el plan Free' },
                { status: 403 }
            );
        }

        // Calculate total from items
        const totalAmount = validItems.reduce((acc, item) => acc + item.monto, 0);

        // Determine trade label
        const tradeLabel = trade?.trim() || 'Servicios profesionales';

        // Insert invoice without quote_id (direct invoice)
        const { data: invoice, error: insertError } = await supabase
            .from('invoices')
            .insert({
                quote_id: null,
                professional_id: professional.id,
                client_name: client_name || null,
                client_phone: client_phone || null,
                client_address: client_address || null,
                trade: tradeLabel,
                description: description || null,
                labor_amount: totalAmount,
                materials_amount: 0,
                total_amount: totalAmount,
                items_snapshot: validItems,
            })
            .select()
            .single();

        if (insertError || !invoice) {
            console.error('Error insertando factura directa:', insertError);
            return NextResponse.json({ error: 'Error al crear la factura' }, { status: 500 });
        }

        // Set public URL
        const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/factura/${invoice.id}`;
        await supabase
            .from('invoices')
            .update({ public_url: publicUrl })
            .eq('id', invoice.id);

        // Increment monthly quota count (same as quotes)
        const newCount = currentCount + 1;
        const newResetAt = sameMonth
            ? professional.quota_reset_at
            : new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        await supabase
            .from('professionals')
            .update({
                monthly_quote_count: newCount,
                quota_reset_at: newResetAt,
            })
            .eq('id', professional.id);

        return NextResponse.json({
            success: true,
            invoiceId: invoice.id,
            publicUrl,
        });
    } catch (err: any) {
        console.error('Direct Invoice API Error:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
