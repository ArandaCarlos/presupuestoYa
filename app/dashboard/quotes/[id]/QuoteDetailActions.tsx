'use client'

import { useState } from 'react'
import { Copy, Share2, Check, Printer } from 'lucide-react'
import type { Quote } from '@/lib/types'

export default function QuoteDetailActions({ quote }: { quote: Quote }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(quote.public_url || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `Presupuesto #${quote.slug.toUpperCase()}`,
                text: `Te envío tu presupuesto de ${quote.trade}: ${quote.public_url}`,
                url: quote.public_url || '',
            })
        } else {
            handleCopy()
        }
    }

    const handlePrint = () => {
        if (quote.public_url) {
            window.open(`${quote.public_url}?print=1`, '_blank')
        } else {
            window.print()
        }
    }

    return (
        <div className="no-print" style={{ 
            display: 'flex', 
            gap: 6, 
            flexWrap: 'wrap',
            justifyContent: 'flex-end' 
        }}>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Descargar PDF" style={{ flex: '1 1 auto', minWidth: 'fit-content' }}>
                <Printer size={14} />
                Descargar
            </button>
            <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Copiar link" style={{ flex: '1 1 auto', minWidth: 'fit-content' }}>
                {copied ? <Check size={14} color="var(--brand-green)" /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button onClick={handleShare} className="btn btn-primary btn-sm" title="Compartir" style={{ flex: '1 1 auto', minWidth: 'fit-content' }}>
                <Share2 size={14} />
                Compartir
            </button>
        </div>
    )
}
