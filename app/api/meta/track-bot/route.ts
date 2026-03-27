import { NextRequest, NextResponse } from 'next/server';
import { metaService } from '@/lib/meta/meta.service';

/**
 * Endpoint para que el bot de n8n dispare eventos de Meta CAPI
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, nombre, ip, userAgent, eventId, eventName, sourceUrl } = body;

        if (!email || !eventName || !eventId) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // Llamada persistente a Meta CAPI
        metaService.track({
            email,
            nombre: nombre || 'Usuario Bot',
            ip: ip || '127.0.0.1',
            userAgent: userAgent || 'WhatsAppBot/1.0',
            eventId,
            eventName,
            sourceUrl: sourceUrl || `${process.env.NEXT_PUBLIC_APP_URL}/whatsapp`
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Track-Bot API Error:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
