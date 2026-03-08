import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
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

export default async function QuotesPage() {
    const supabase = await createClient()

    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

    const all = quotes || []

    function formatCurrency(n: number) {
        return `$${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
    }

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>Presupuestos</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
                        {all.length} presupuesto{all.length !== 1 ? 's' : ''} en total
                    </p>
                </div>
                <Link href="/dashboard/quotes/new" className="btn btn-primary">
                    <Plus size={16} /> Nuevo
                </Link>
            </div>

            {all.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                    <FileText size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>
                        Sin presupuestos aún
                    </h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>
                        Creá tu primer presupuesto y compartilo con tu cliente.
                    </p>
                    <Link href="/dashboard/quotes/new" className="btn btn-primary">
                        <Plus size={16} /> Crear presupuesto
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {all.map((q: Quote) => (
                        <Link key={q.id} href={`/dashboard/quotes/${q.id}`} style={{ textDecoration: 'none' }}>
                            <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>{q.trade}</span>
                                        <QuoteStatusBadge status={q.status} />
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>
                                        {q.client_name ? `Para: ${q.client_name}` : 'Sin cliente especificado'}
                                        {q.address ? ` · ${q.address}` : ''}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gray-900)' }}>
                                        {formatCurrency(q.total_amount)}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                                        {formatDate(q.created_at)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
