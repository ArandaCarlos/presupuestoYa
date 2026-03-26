import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { metaService } from '@/lib/meta/meta.service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { 
            client_name, client_phone, trade, address, description, 
            materials_included, materials_detail, materials_amount,
            labor_description, labor_amount, validity_days 
        } = body;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // 1. Obtener profesional y validar cuota
        const { data: professional } = await supabase
            .from('professionals')
            .select('id, user_id, monthly_quote_count, plan')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!professional) {
            return NextResponse.json({ error: 'No se encontró perfil profesional' }, { status: 404 });
        }

        if (professional.plan === 'free' && professional.monthly_quote_count >= 5) {
            return NextResponse.json({ error: 'Límite de presupuestos alcanzado' }, { status: 403 });
        }

        // 2. Generar datos necesarios (slug, expires_at)
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let slug = '';
        for (let i = 0; i < 8; i++) slug += chars[Math.floor(Math.random() * chars.length)];

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (validity_days || 7));
        const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`;

        // 3. Insertar presupuesto
        const { data: quote, error: dbError } = await supabase.from('quotes').insert({
            slug,
            professional_id: professional.id,
            client_name: client_name || null,
            client_phone: client_phone || null,
            trade,
            address: address || null,
            description: description || null,
            materials_included,
            materials_detail: materials_included ? materials_detail || null : null,
            materials_amount: materials_included ? materials_amount : 0,
            labor_description: labor_description || null,
            labor_amount: labor_amount || 0,
            validity_days: validity_days || 7,
            expires_at: expiresAt.toISOString(),
            status: 'sent',
            channel: 'web',
            public_url: publicUrl,
        }).select().single();

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json({ error: 'Error al guardar en base de datos' }, { status: 400 });
        }

        // 4. Meta CAPI: StartTrial si es el primer presupuesto (count === 0)
        let eventId = null;
        if (professional.monthly_quote_count === 0) {
            eventId = `trial_${user.id}_${Date.now()}`;
            const forwarded = req.headers.get('x-forwarded-for');
            const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
            const userAgent = req.headers.get('user-agent') || 'unknown';

            metaService.track({
                email: user.email!,
                nombre: (user.user_metadata?.full_name as string) || 'Usuario',
                ip,
                userAgent,
                eventId,
                eventName: 'StartTrial',
                sourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/quotes/new`
            });
        }

        return NextResponse.json({ success: true, quote, eventId });

    } catch (err: any) {
        console.error('Quote API Error:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
