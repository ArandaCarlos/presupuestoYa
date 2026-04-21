import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, Receipt } from 'lucide-react'
import type { Quote } from '@/lib/types'
import QuotesTable from '../../components/QuotesTable'
import InvoicesTable from '../../components/InvoicesTable'
import SearchFilters from './SearchFilters'
import Pagination from './Pagination'

export default async function QuotesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const tab = typeof params.tab === 'string' ? params.tab : 'quotes'
    const query = typeof params.query === 'string' ? params.query : ''
    const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
    const PAGE_SIZE = 10

    const supabase = await createClient()

    // Get current professional
    const { data: { user } } = await supabase.auth.getUser()
    const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id || '00000000-0000-0000-0000-000000000000')
        .maybeSingle()

    const profId = professional?.id ?? '00000000-0000-0000-0000-000000000000'
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // ── Quotes ──
    let quotesQuery = supabase
        .from('quotes')
        .select('*', { count: 'exact' })
        .eq('professional_id', profId)
        .order('created_at', { ascending: false })

    if (query && tab === 'quotes') {
        quotesQuery = quotesQuery.or(`client_name.ilike.%${query}%,trade.ilike.%${query}%`)
    }
    const quotesQueryPaged = tab === 'quotes' ? quotesQuery.range(from, to) : quotesQuery.range(0, 0)
    const { data: quotes, count: quotesCount } = await quotesQueryPaged

    // ── Invoices ──
    let invoicesQuery = supabase
        .from('invoices')
        .select('id, invoice_number, client_name, client_phone, trade, total_amount, created_at, public_url, quote_id', { count: 'exact' })
        .eq('professional_id', profId)
        .order('created_at', { ascending: false })

    if (query && tab === 'invoices') {
        invoicesQuery = invoicesQuery.or(`client_name.ilike.%${query}%,trade.ilike.%${query}%`)
    }
    const invoicesQueryPaged = tab === 'invoices' ? invoicesQuery.range(from, to) : invoicesQuery.range(0, 0)
    const { data: invoices, count: invoicesCount } = await invoicesQueryPaged

    // Counts for total display (without pagination)
    const { count: totalQuotesCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', profId)

    const { count: totalInvoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', profId)

    const isQuotesTab = tab === 'quotes'
    const activeData = isQuotesTab ? (quotes || []) : (invoices || [])
    const activeCount = isQuotesTab ? (quotesCount || 0) : (invoicesCount || 0)
    const totalPages = Math.ceil(activeCount / PAGE_SIZE)

    // Helpers to build tab URLs preserving other params
    function tabUrl(t: string) {
        return `?tab=${t}${query ? `&query=${encodeURIComponent(query)}` : ''}&page=1`
    }

    return (
        <div className="fade-in">
            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>
                    Presupuestos y Facturas
                </h1>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
                    {(totalQuotesCount || 0)} presupuesto{(totalQuotesCount || 0) !== 1 ? 's' : ''}
                    {' · '}
                    {(totalInvoicesCount || 0)} factura{(totalInvoicesCount || 0) !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid var(--gray-200)' }}>
                <Link
                    href={tabUrl('quotes')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '10px 20px',
                        fontSize: 14, fontWeight: 700, textDecoration: 'none',
                        borderBottom: isQuotesTab ? '2px solid var(--brand-accent)' : '2px solid transparent',
                        color: isQuotesTab ? 'var(--brand-accent)' : 'var(--gray-400)',
                        marginBottom: -2, transition: 'all 0.15s'
                    }}
                >
                    <FileText size={15} />
                    Presupuestos
                    {(totalQuotesCount || 0) > 0 && (
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            background: isQuotesTab ? 'var(--brand-accent)' : 'var(--gray-200)',
                            color: isQuotesTab ? 'white' : 'var(--gray-500)',
                            padding: '2px 6px', borderRadius: 20, minWidth: 20, textAlign: 'center'
                        }}>
                            {totalQuotesCount}
                        </span>
                    )}
                </Link>
                <Link
                    href={tabUrl('invoices')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '10px 20px',
                        fontSize: 14, fontWeight: 700, textDecoration: 'none',
                        borderBottom: !isQuotesTab ? '2px solid #7c3aed' : '2px solid transparent',
                        color: !isQuotesTab ? '#7c3aed' : 'var(--gray-400)',
                        marginBottom: -2, transition: 'all 0.15s'
                    }}
                >
                    <Receipt size={15} />
                    Facturas
                    {(totalInvoicesCount || 0) > 0 && (
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            background: !isQuotesTab ? '#7c3aed' : 'var(--gray-200)',
                            color: !isQuotesTab ? 'white' : 'var(--gray-500)',
                            padding: '2px 6px', borderRadius: 20, minWidth: 20, textAlign: 'center'
                        }}>
                            {totalInvoicesCount}
                        </span>
                    )}
                </Link>
            </div>

            {/* Search + New button row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                <SearchFilters />
                <Link
                    href={isQuotesTab ? '/dashboard/quotes/new' : '/dashboard/invoices/new'}
                    className="btn btn-primary"
                    style={{
                        whiteSpace: 'nowrap',
                        background: isQuotesTab
                            ? 'linear-gradient(135deg, var(--brand-accent), #1d4ed8)'
                            : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        boxShadow: isQuotesTab
                            ? '0 2px 8px rgb(37 99 235 / 0.3)'
                            : '0 2px 8px rgba(124,58,237,0.3)'
                    }}
                >
                    <Plus size={16} />
                    {isQuotesTab ? 'Nuevo presupuesto' : 'Nueva factura'}
                </Link>
            </div>

            {/* Content */}
            {activeData.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                    {isQuotesTab
                        ? <FileText size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
                        : <Receipt size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
                    }
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>
                        {query
                            ? 'No se encontraron resultados'
                            : isQuotesTab ? 'Sin presupuestos aún' : 'Sin facturas aún'
                        }
                    </h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>
                        {query
                            ? 'Probá buscar con otros términos.'
                            : isQuotesTab
                                ? 'Creá tu primer presupuesto y compartilo con tu cliente.'
                                : 'Creá tu primera factura cargando los ítems del trabajo.'
                        }
                    </p>
                    {!query && (
                        <Link
                            href={isQuotesTab ? '/dashboard/quotes/new' : '/dashboard/invoices/new'}
                            className="btn btn-primary"
                            style={{
                                background: isQuotesTab
                                    ? 'linear-gradient(135deg, var(--brand-accent), #1d4ed8)'
                                    : 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                            }}
                        >
                            <Plus size={16} />
                            {isQuotesTab ? 'Crear presupuesto' : 'Crear factura'}
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {isQuotesTab
                        ? <QuotesTable quotes={activeData as Quote[]} />
                        : <InvoicesTable invoices={activeData as any[]} />
                    }
                    <Pagination totalPages={totalPages} />
                </>
            )}
        </div>
    )
}
