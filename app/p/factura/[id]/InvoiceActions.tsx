'use client'

import { Printer, Share2 } from 'lucide-react'
import { useState } from 'react'

export default function InvoiceActions({ invoiceNumber, publicUrl }: { invoiceNumber: string, publicUrl: string }) {
    const handlePrint = () => {
        window.print()
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `Factura ${invoiceNumber}`,
                text: `Te envío tu factura: ${publicUrl}`,
                url: publicUrl,
            })
        } else {
            await navigator.clipboard.writeText(publicUrl)
            alert('Enlace copiado al portapapeles.')
        }
    }

    return (
        <div className="no-print" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 12, 
            padding: '24px 16px',
            background: 'var(--gray-50)',
            borderBottom: '1px solid var(--gray-200)'
        }}>
            <button 
                onClick={handlePrint} 
                className="btn btn-primary" 
                style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14 }}
            >
                <Printer size={16} /> Descargar PDF
            </button>
            <button 
                onClick={handleShare} 
                className="btn btn-secondary" 
                style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14 }}
            >
                <Share2 size={16} /> Compartir
            </button>
        </div>
    )
}
