import { MercadoPagoConfig, PreApproval } from 'mercadopago'

// Inicializar cliente MP
export function getMPClient() {
    return new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    })
}

// Crear una suscripción para un usuario
export async function createSubscription({
    payerEmail,
    professionalId,
    backUrl,
}: {
    payerEmail: string
    professionalId: string
    backUrl: string
}) {
    const client = getMPClient()
    const preApproval = new PreApproval(client)

    const response = await preApproval.create({
        body: {
            preapproval_plan_id: process.env.MERCADOPAGO_PLAN_ID!,
            payer_email: payerEmail,
            card_token_id: undefined, // el usuario lo ingresa en el checkout
            back_url: backUrl,
            // metadata para identificar al profesional en el webhook
            external_reference: professionalId,
        }
    })

    return response
}

// Obtener el estado de una suscripción
export async function getSubscription(subscriptionId: string) {
    const client = getMPClient()
    const preApproval = new PreApproval(client)
    return await preApproval.get({ id: subscriptionId })
}

// Verificar si un webhook viene realmente de MercadoPago
export function verifyWebhookSignature(
    xSignature: string | null,
    xRequestId: string | null,
    dataId: string,
): boolean {
    // En producción podés verificar la firma HMAC-SHA256
    // Por ahora validamos que el secret esté presente
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (!secret) return true // skip en dev si no está configurado
    return xSignature !== null
}

// Mapeo de estado MP → plan interno
export function mpStatusToPlan(mpStatus: string): { plan: string; subscriptionStatus: string } {
    switch (mpStatus) {
        case 'authorized':
            return { plan: 'pro', subscriptionStatus: 'active' }
        case 'paused':
            return { plan: 'free', subscriptionStatus: 'paused' }
        case 'cancelled':
        case 'pending':
        default:
            return { plan: 'free', subscriptionStatus: mpStatus }
    }
}
