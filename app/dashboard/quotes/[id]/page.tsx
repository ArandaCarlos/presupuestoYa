import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, CheckCircle, Clock, ExternalLink, Share2, RefreshCcw } from 'lucide-react'
import type { Quote } from '@/lib/types'
import QuoteDetailActions from './QuoteDetailActions'
import GenerateInvoiceButton from './GenerateInvoiceButton'

interface Props {
    params: Promise<{ id: string }>
    searchParams: Promise<{ new?: string }>
}

function formatCurrency(n: number) {
    return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric'
    })
}

// Helper to render basic markdown bold
const renderMarkdown = (text: string | null | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
    });
};

export default async function QuoteDetailPage({ params, searchParams }: Props) {
    const { id } = await params
    const { new: isNew } = await searchParams
    const supabase = await createClient()

    const { data: quote, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !quote) redirect('/dashboard/quotes')

    // Check if invoice exists
    const { data: invoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('quote_id', id)
        .single()

    const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
        sent: { label: 'Enviado', cls: 'badge-blue', icon: '📤' },
        viewed: { label: 'Visto ✓', cls: 'badge-yellow', icon: '👁' },
        accepted: { label: 'Aceptado ✓', cls: 'badge-green', icon: '✅' },
        rejected: { label: 'Rechazado', cls: 'badge-red', icon: '❌' },
        expired: { label: 'Vencido', cls: 'badge-gray', icon: '⏰' },
        draft: { label: 'Borrador', cls: 'badge-gray', icon: '📝' },
    }
    const st = statusMap[quote.status] || statusMap.draft

    return (
        <div className="fade-in" style={{ maxWidth: 640 }}>
            {/* Breadcrumb */}
            <Link href="/dashboard/quotes" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 0 }}>
                <ArrowLeft size={16} /> Presupuestos
            </Link>

            {/* Alerta "nuevo" */}
            {isNew && (
                <div style={{
                    background: 'linear-gradient(135deg, #15803d, #16a34a)',
                    borderRadius: 14, padding: '16px 20px', marginBottom: 20, color: 'white',
                    display: 'flex', alignItems: 'center', gap: 12
                }}>
                    <CheckCircle size={24} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>¡Presupuesto creado!</div>
                        <div style={{ fontSize: 13, opacity: 0.85 }}>Copiá el link y compartilo con el cliente.</div>
                    </div>
                </div>
            )}

            {/* Header card */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'monospace', marginBottom: 4 }}>
                            #{quote.slug.toUpperCase()}
                        </div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>
                            {quote.trade}
                        </h1>
                        {quote.client_name && (
                            <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>Para: {quote.client_name}</div>
                        )}
                    </div>
                    <span className={`badge ${st.cls}`} style={{ fontSize: 13 }}>
                        {st.icon} {st.label}
                    </span>
                </div>

                {/* Link para compartir */}
                <div style={{
                    background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                    borderRadius: 10, padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 10
                }}>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--brand-accent)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {quote.public_url}
                    </div>
                    <QuoteDetailActions quote={quote as Quote} />
                </div>
            </div>

            {/* Detalles */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-400)', marginBottom: 16 }}>
                    Detalle del presupuesto
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <Row label="Mano de obra" value={formatCurrency(quote.labor_amount)} />
                    {quote.labor_description && (
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '0 0 12px 0', borderBottom: '1px solid var(--gray-100)', marginTop: -8, whiteSpace: 'pre-wrap' }}>
                            {renderMarkdown(quote.labor_description)}
                        </div>
                    )}
                    {quote.materials_included && <Row label="Materiales" value={formatCurrency(quote.materials_amount)} />}
                    {quote.materials_detail && (
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '0 0 12px 0', borderBottom: '1px solid var(--gray-100)', marginTop: -8, whiteSpace: 'pre-wrap' }}>
                            {quote.materials_detail}
                        </div>
                    )}
                    {!quote.materials_included && (
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', fontStyle: 'italic', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                            * Materiales no incluidos
                        </div>
                    )}
                </div>

                {/* Total */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--brand-blue), #1e40af)',
                    borderRadius: 12, padding: '16px 20px', marginTop: 16,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>TOTAL</span>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: 24 }}>{formatCurrency(quote.total_amount)}</span>
                </div>
            </div>

            {/* Info adicional */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {quote.address && <Row label="Dirección" value={quote.address} />}
                    <Row label="Vigencia" value={`${quote.validity_days} días`} />
                    <Row label="Vence" value={formatDate(quote.expires_at)} />
                    <Row label="Creado" value={formatDate(quote.created_at)} />
                    {quote.viewed_at && <Row label="Visto" value={formatDate(quote.viewed_at)} />}
                    {quote.accepted_at && <Row label="Aceptado" value={formatDate(quote.accepted_at)} />}
                </div>
            </div>

            {/* Acciones del footer */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={`/p/${quote.slug}`} target="_blank" rel="noopener noreferrer"
                    className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
                    <ExternalLink size={16} /> Ver como cliente
                </a>

                {['rejected', 'expired', 'sent', 'viewed'].includes(quote.status) && (
                    <Link
                        href={`/dashboard/quotes/new?from=${quote.id}`}
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
                    >
                        <RefreshCcw size={16} />
                        {quote.status === 'rejected' ? 'Duplicar y corregir' : 'Duplicar'}
                    </Link>
                )}

                {quote.status === 'accepted' && (
                    <GenerateInvoiceButton quoteId={quote.id} existingInvoiceId={invoice?.id} />
                )}
            </div>
        </div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '12px 0', borderBottom: '1px solid var(--gray-100)'
        }}>
            <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{value}</span>
        </div>
    )
}
