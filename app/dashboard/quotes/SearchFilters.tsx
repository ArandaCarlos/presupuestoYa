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
            const params = new URLSearchParams(searchParams.toString())
            const currentQuery = params.get('query') || ''
            
            // Si la búsqueda escrita es igual a la que ya está en la URL, no hacemos nada.
            // Esto evita que al cambiar de página (que actualiza searchParams),
            // este efecto se dispare y nos resetee a la página 1.
            if (query.trim() === currentQuery.trim()) return
 
            if (query.trim()) {
                params.set('query', query.trim())
            } else {
                params.delete('query')
            }
            
            // Si realmente cambió el texto de búsqueda, ahí sí volvemos a la página 1
            params.set('page', '1')
            
            router.push(`?${params.toString()}`)
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
