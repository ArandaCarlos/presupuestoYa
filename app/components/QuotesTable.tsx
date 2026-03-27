'use client'

import { Plus, FileText, CheckCircle, Clock, Send, TrendingUp, Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Quote } from '@/lib/types'

function QuoteStatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        sent: { label: 'Enviado', cls: 'badge-blue' },
        viewed: { label: 'Visto ✓', cls: 'badge-yellow' },
        accepted: { label: 'Aceptado ✓', cls: 'badge-green' },
        rejected: { label: 'Rechazado', cls: 'badge-red' },
        expired: { label: 'Vencido', cls: 'badge-gray' },
        draft: { label: 'Borrador', cls: 'badge-gray' },
    }
    const { label, cls } = map[status] || { label: status, cls: 'badge-gray' }
    return <span className={`badge ${cls}`}>{label}</span>
}

interface QuotesTableProps {
    quotes: Quote[]
}

export default function QuotesTable({ quotes }: QuotesTableProps) {
    const router = useRouter()
    const [copiedId, setCopiedId] = useState<string | null>(null)

    function formatCurrency(n: number) {
        return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
    }

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    }

    const handleRowClick = (quoteId: string) => {
        router.push(`/dashboard/quotes/${quoteId}`)
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
                .quotes-desktop { display: block; }
                .quotes-mobile { display: none; }
                
                @media (max-width: 768px) {
                    .quotes-desktop { display: none; }
                    .quotes-mobile { display: flex; flex-direction: column; gap: 8px; }
                }

                .quote-card-mobile {
                    background: white;
                    border-radius: 16px;
                    padding: 12px 16px;
                    border: 1px solid var(--gray-100);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    text-decoration: none;
                }
                .quote-card-mobile:active {
                    transform: scale(0.98);
                }
                
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
                    transition: all 0.2s;
                }
                .btn-copy:hover {
                    background: white;
                    border-color: var(--brand-blue);
                    color: var(--brand-blue);
                }
                .btn-copy.copied {
                    background: #f0fdf4;
                    border-color: #86efac;
                    color: #16a34a;
                }
            `}} />

            {/* VISTA DESKTOP: Tabla Tradicional */}
            <div className="quotes-desktop card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                                {['#', 'Trabajo', 'Cliente', 'Total', 'Estado', 'Fecha', 'Link', 'Acción'].map(h => (
                                    <th key={h} style={{
                                        padding: '10px 16px', textAlign: 'left',
                                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                        letterSpacing: '0.8px', color: 'var(--gray-400)'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((q: Quote) => (
                                <tr
                                    key={q.id}
                                    onClick={() => handleRowClick(q.id)}
                                    style={{
                                        borderBottom: '1px solid var(--gray-100)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    className="card-hover"
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--gray-400)' }}>
                                        #{q.slug.toUpperCase()}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                                        {q.trade}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--gray-500)' }}>
                                        {q.client_name || <span style={{ color: 'var(--gray-300)', fontStyle: 'italic' }}>Sin nombre</span>}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                                        {formatCurrency(q.total_amount)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <QuoteStatusBadge status={q.status} />
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-400)' }}>
                                        {formatDate(q.created_at)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button 
                                            onClick={(e) => handleCopy(e, q.public_url, q.id)}
                                            className={`btn-copy ${copiedId === q.id ? 'copied' : ''}`}
                                        >
                                            {copiedId === q.id ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedId === q.id ? 'Copiado' : 'Link'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/dashboard/quotes/${q.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 12, padding: '4px 8px' }}>
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* VISTA MOBILE: Tarjetas (Cards) */}
            <div className="quotes-mobile">
                {quotes.map((q: Quote) => (
                    <div 
                        key={q.id} 
                        className="quote-card-mobile"
                        onClick={() => handleRowClick(q.id)}
                    >
                        {/* Row 1: Título y Monto */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{q.trade}</span>
                                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>
                                    #{q.slug.toUpperCase()}
                                </span>
                            </div>
                            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--brand-blue)' }}>
                                {formatCurrency(q.total_amount)}
                            </span>
                        </div>
                        
                        {/* Row 2: Cliente, Fecha y Estado */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', gap: 6 }}>
                                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {q.client_name || 'Sin cliente'}
                                </span>
                                <span style={{ color: 'var(--gray-300)' }}>•</span>
                                <span>{formatDate(q.created_at)}</span>
                            </div>
                            <QuoteStatusBadge status={q.status} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
