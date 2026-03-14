// Tipos compartidos del dominio PresupuestoYA

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

export interface Professional {
    id: string
    whatsapp_number: string
    name: string | null
    trade: string | null
    logo_url: string | null
    plan: 'free' | 'pro' | 'pro_plus'
    monthly_quote_count: number
    created_at: string
}

export interface Quote {
    id: string
    slug: string
    professional_id: string | null
    client_name: string | null
    client_phone: string | null
    trade: string
    address: string | null
    description: string | null
    materials_included: boolean
    materials_detail: string | null
    materials_amount: number
    labor_description: string | null
    labor_amount: number
    total_amount: number
    validity_days: number
    expires_at: string | null
    status: QuoteStatus
    pdf_url: string | null
    public_url: string | null
    channel: 'whatsapp' | 'web'
    reminder_sent: boolean
    viewed_at: string | null
    accepted_at: string | null
    rejected_at: string | null
    client_signature_name: string | null
    client_signature_dni: string | null
    client_signature_data: string | null
    client_signature_date: string | null
    created_at: string
    updated_at: string
    // Join con professionals (cuando se hace select con *)
    professionals?: Professional
}

export interface QuoteItem {
    id: string
    quote_id: string
    description: string
    quantity: number
    unit_price: number
    total: number
    sort_order: number
}

export interface CreateQuoteInput {
    client_name?: string
    client_phone?: string
    trade: string
    address?: string
    description?: string
    materials_included: boolean
    materials_detail?: string
    materials_amount?: number
    labor_description?: string
    labor_amount: number
    validity_days: number
}
