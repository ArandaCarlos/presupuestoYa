'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Receipt } from 'lucide-react'

export default function GenerateInvoiceButton({ quoteId, existingInvoiceId }: { quoteId: string, existingInvoiceId?: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleGenerate = async () => {
        if (existingInvoiceId) {
            router.push(`/p/factura/${existingInvoiceId}`)
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/invoices/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quoteId })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Error al generar la factura')
                setLoading(false)
                return
            }

            if (data.invoiceId) {
                router.push(`/p/factura/${data.invoiceId}`)
            }
        } catch (error) {
            console.error(error)
            alert('Ocurrió un error inesperado al generar la factura.')
            setLoading(false)
        }
    }

    if (existingInvoiceId) {
        return (
            <button 
                onClick={() => router.push(`/p/factura/${existingInvoiceId}`)}
                className="btn btn-secondary" 
                style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
            >
                <Receipt size={16} />
                Ver Factura
            </button>
        )
    }

    return (
        <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="btn btn-green" 
            style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
        >
            <Receipt size={16} />
            {loading ? 'Generando...' : 'Generar Factura'}
        </button>
    )
}
