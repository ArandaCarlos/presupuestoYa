'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Check, ExternalLink, Receipt } from 'lucide-react'

interface Invoice {
    id: string
    invoice_number: string
    client_name: string | null
    client_phone: string | null
    trade: string | null
    total_amount: number
    created_at: string
    public_url: string | null
    quote_id: string | null   // null = factura directa
}

function formatCurrency(n: number) {
    return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

function InvoiceTypeBadge({ quoteId }: { quoteId: string | null }) {
    if (quoteId) {
        return (
            <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                background: '#eff6ff', color: 'var(--brand-accent)',
                border: '1px solid #dbeafe', whiteSpace: 'nowrap'
            }}>
                Desde presupuesto
            </span>
        )
    }
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            background: '#f5f3ff', color: '#7c3aed',
            border: '1px solid #ede9fe', whiteSpace: 'nowrap'
        }}>
            Directa
        </span>
    )
}

interface InvoicesTableProps {
    invoices: Invoice[]
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
    const router = useRouter()
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleRowClick = (id: string) => {
        router.push(`/p/factura/${id}`)
    }

    const handleCopy = async (e: React.MouseEvent, url: string | null, id: string) => {
        e.stopPropagation()
        if (!url) return
        try {
            await navigator.clipboard.writeText(url)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .invoices-desktop { display: block; }
                .invoices-mobile { display: none; }

                @media (max-width: 768px) {
                    .invoices-desktop { display: none; }
                    .invoices-mobile { display: flex; flex-direction: column; gap: 8px; }
                }

                .invoice-card-mobile {
                    background: white;
                    border-radius: 16px;
                    padding: 12px 16px;
                    border: 1px solid var(--gray-100);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }
                .invoice-card-mobile:active { transform: scale(0.98); }

                .btn-copy {
                    background: var(--gray-50);
                    border: 1px solid var(--gray-200);
                    color: var(--gray-600);
                    padding: 6px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-copy:hover { background: white; border-color: #7c3aed; color: #7c3aed; }
                .btn-copy.copied { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
            `}} />

            {/* VISTA DESKTOP */}
            <div className="invoices-desktop card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
                        <thead>
                            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                                {['N° Factura', 'Servicio', 'Cliente', 'Total', 'Tipo', 'Fecha', 'Link', 'Acción'].map(h => (
                                    <th key={h} style={{
                                        padding: '10px 16px', textAlign: 'left',
                                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                        letterSpacing: '0.8px', color: 'var(--gray-400)'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr
                                    key={inv.id}
                                    onClick={() => handleRowClick(inv.id)}
                                    style={{ borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--gray-500)', fontWeight: 600 }}>
                                        {inv.invoice_number}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                                        {inv.trade || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--gray-500)' }}>
                                        {inv.client_name || <span style={{ color: 'var(--gray-300)', fontStyle: 'italic' }}>Sin nombre</span>}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                                        {formatCurrency(inv.total_amount)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <InvoiceTypeBadge quoteId={inv.quote_id} />
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-400)' }}>
                                        {formatDate(inv.created_at)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button
                                            onClick={e => handleCopy(e, inv.public_url, inv.id)}
                                            className={`btn-copy ${copiedId === inv.id ? 'copied' : ''}`}
                                        >
                                            {copiedId === inv.id ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedId === inv.id ? 'Copiado' : 'Link'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                                        <Link href={`/p/factura/${inv.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 12, padding: '4px 8px' }}>
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* VISTA MOBILE */}
            <div className="invoices-mobile">
                {invoices.map(inv => (
                    <div
                        key={inv.id}
                        className="invoice-card-mobile"
                        onClick={() => handleRowClick(inv.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>
                                    {inv.trade || 'Servicios'}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>
                                    {inv.invoice_number}
                                </span>
                            </div>
                            <span style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>
                                {formatCurrency(inv.total_amount)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', gap: 6 }}>
                                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {inv.client_name || 'Sin cliente'}
                                </span>
                                <span style={{ color: 'var(--gray-300)' }}>•</span>
                                <span>{formatDate(inv.created_at)}</span>
                            </div>
                            <InvoiceTypeBadge quoteId={inv.quote_id} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
