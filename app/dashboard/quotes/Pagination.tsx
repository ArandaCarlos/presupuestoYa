'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ totalPages }: { totalPages: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const currentPage = Number(searchParams.get('page')) || 1

    if (totalPages <= 1) return null

    const handlePage = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.set('page', String(page))
        router.push(`?${current.toString()}`)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <button
                onClick={() => handlePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="btn btn-secondary btn-sm"
            >
                <ChevronLeft size={16} /> Anterior
            </button>
            <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => handlePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="btn btn-secondary btn-sm"
            >
                Siguiente <ChevronRight size={16} />
            </button>
        </div>
    )
}
