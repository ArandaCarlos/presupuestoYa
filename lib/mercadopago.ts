import { MercadoPagoConfig, Preference } from 'mercadopago'

// Inicializar cliente MP
export function getMPClient() {
    return new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    })
}

// Mapeo de estado MP (pago único) → plan interno
export function mpPaymentStatusToPlan(mpStatus: string): { plan: string; statusDesc: string } {
    switch (mpStatus) {
        case 'approved':
            return { plan: 'pro', statusDesc: 'active' }
        case 'in_process':
        case 'pending':
            return { plan: 'free', statusDesc: 'pending_payment' }
        case 'rejected':
        case 'cancelled':
        case 'refunded':
        case 'charged_back':
        default:
            return { plan: 'free', statusDesc: mpStatus }
    }
}
