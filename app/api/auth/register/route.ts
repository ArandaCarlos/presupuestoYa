import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { metaService } from '@/lib/meta/meta.service';

export async function POST(req: NextRequest) {
    try {
        const { email, password, nombre } = await req.json();
        
        // Obtener IP y User Agent para Meta
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        const supabase = await createClient();

        // 1. Crear usuario en Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: nombre }
            }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const userId = data.user?.id || 'anonymous';
        const eventId = `reg_${userId}_${Date.now()}`;

        // 2. Meta CAPI (se ejecuta en segundo plano, no bloquea)
        metaService.track({
            email,
            nombre,
            ip,
            userAgent,
            eventId,
            eventName: 'CompleteRegistration',
            sourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login` // Donde ocurre el registro
        });

        return NextResponse.json({ 
            success: true, 
            eventId,
            userId: data.user?.id
        });

    } catch (err: any) {
        console.error('Registration API Error:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
