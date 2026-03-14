'use client'

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

    function formatCurrency(n: number) {
        return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
    }

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    }

    const handleRowClick = (quoteId: string) => {
        router.push(`/dashboard/quotes/${quoteId}`)
    }

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Wrapper para scroll horizontal en mobile */}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                            {['#', 'Trabajo', 'Cliente', 'Total', 'Estado', 'Fecha', ''].map(h => (
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
                                <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                                    <Link href={`/dashboard/quotes/${q.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                                        Ver →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}