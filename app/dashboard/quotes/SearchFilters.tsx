'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [query, setQuery] = useState(searchParams.get('query') || '')

    // Debounce search update
    useEffect(() => {
        const timeout = setTimeout(() => {
            const current = new URLSearchParams(Array.from(searchParams.entries()))
            
            if (query.trim()) {
                current.set('query', query.trim())
            } else {
                current.delete('query')
            }
            
            // Si cambia la búsqueda, volvemos a la página 1
            current.set('page', '1')
            
            // Only push if the URL actually changed to avoid infinite loops
            const urlString = current.toString()
            const originalString = searchParams.toString()
            
            if (urlString !== originalString) {
                router.push(`?${urlString}`)
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [query, router, searchParams])

    return (
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <div style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--gray-400)', pointerEvents: 'none', display: 'flex'
            }}>
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder="Buscar cliente o trabajo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input"
                style={{
                    width: '100%',
                    paddingLeft: 42,
                    background: 'white',
                    borderColor: 'var(--gray-200)'
                }}
            />
        </div>
    )
}
