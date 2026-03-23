import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import type { Quote } from '@/lib/types'
import QuotesTable from '../../components/QuotesTable'
import SearchFilters from './SearchFilters'
import Pagination from './Pagination'

export default async function QuotesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const query = typeof params.query === 'string' ? params.query : ''
    const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
    const PAGE_SIZE = 10

    const supabase = await createClient()

    // 1. Get current professional
    const { data: { user } } = await supabase.auth.getUser()
    const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id || '00000000-0000-0000-0000-000000000000')
        .maybeSingle()

    const profId = professional?.id ?? '00000000-0000-0000-0000-000000000000'

    // 2. Query builder
    let dbQuery = supabase
        .from('quotes')
        .select('*', { count: 'exact' })
        .eq('professional_id', profId)
        .order('created_at', { ascending: false })

    if (query) {
        // Search by client_name or trade
        dbQuery = dbQuery.or(`client_name.ilike.%${query}%,trade.ilike.%${query}%`)
    }

    // Pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    dbQuery = dbQuery.range(from, to)

    const { data: quotes, count } = await dbQuery

    const all = quotes || []
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>Presupuestos</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
                        {totalCount} presupuesto{totalCount !== 1 ? 's' : ''} en total
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <SearchFilters />
                    <Link href="/dashboard/quotes/new" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={16} /> Nuevo
                    </Link>
                </div>
            </div>

            {all.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                    <FileText size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>
                        {query ? 'No se encontraron resultados' : 'Sin presupuestos aún'}
                    </h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>
                        {query ? 'Probá buscar con otros términos.' : 'Creá tu primer presupuesto y compartilo con tu cliente.'}
                    </p>
                    {!query && (
                        <Link href="/dashboard/quotes/new" className="btn btn-primary">
                            <Plus size={16} /> Crear presupuesto
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <QuotesTable quotes={all} />
                    <Pagination totalPages={totalPages} />
                </>
            )}
        </div>
    )
}
