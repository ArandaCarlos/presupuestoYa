import crypto from 'crypto';

export interface MetaTrackData {
    email: string;
    nombre: string;
    ip: string;
    userAgent: string;
    eventId: string;
    eventName: 'CompleteRegistration' | 'StartTrial' | string;
    sourceUrl: string;
}

class MetaService {
    private pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    private accessToken = process.env.META_ACCESS_TOKEN;
    private apiVersion = process.env.META_API_VERSION || 'v19.0';
    private testEventCode = process.env.META_TEST_EVENT_CODE;

    private hash(value: string): string {
        return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
    }

    /**
     * Envía un evento a la API de Conversiones de Meta.
     * Se ejecuta en segundo plano sin bloquear el flujo principal.
     */
    track(data: MetaTrackData): void {
        if (!this.pixelId || !this.accessToken) {
            console.error('MetaService: Faltan credenciales (META_PIXEL_ID o META_ACCESS_TOKEN)');
            return;
        }

        const hashedEmail = this.hash(data.email);
        const hashedFirstName = this.hash(data.nombre);

        const payload = {
            data: [{
                event_name: data.eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: data.sourceUrl,
                event_id: data.eventId,
                user_data: {
                    em: [hashedEmail],
                    fn: [hashedFirstName],
                    client_ip_address: data.ip,
                    client_user_agent: data.userAgent,
                }
            }],
            ...(this.testEventCode ? { test_event_code: this.testEventCode } : {})
        };

        const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events?access_token=${this.accessToken}`;

        // Llamada fetch sin await para no bloquear
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async (res) => {
            if (!res.ok) {
                const err = await res.json();
                console.error('Meta CAPI Error Response:', err);
            } else {
                console.log(`Meta CAPI Success: ${data.eventName}`);
            }
        }).catch(err => {
            console.error('Meta CAPI Request Failed:', err);
        });
    }
}

export const metaService = new MetaService();
