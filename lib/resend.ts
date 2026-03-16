import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey && process.env.NODE_ENV === 'production') {
    console.warn('RESEND_API_KEY is not defined')
}

export const resend = new Resend(resendApiKey)

export const DEFAULT_FROM_EMAIL = 'PresupuestosYA <soporte.presupuestoya@gmail.com>'
