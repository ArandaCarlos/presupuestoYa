import { createClient } from '@/lib/supabase/server'
import InvoiceActions from './InvoiceActions'
import { notFound } from 'next/navigation'

function formatCurrency(n: number) {
    return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

// Helper to render basic markdown bold
const renderMarkdown = (text: string | null | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
    });
};

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: invoice, error } = await supabase
        .from('invoices')
        .select(`
            *,
            professionals (*)
        `)
        .eq('id', id)
        .single()

    if (error || !invoice) {
        notFound()
    }

    const professional = invoice.professionals as any
    const items: { descripcion: string; monto: number }[] =
        Array.isArray(invoice.items_snapshot) && invoice.items_snapshot.length > 0
            ? invoice.items_snapshot as { descripcion: string; monto: number }[]
            : []

    return (
        <div style={{ minHeight: '100vh', background: '#d1d5db', fontFamily: 'system-ui, sans-serif' }}>
            {/* Acciones flotantes que no se imprimen */}
            <InvoiceActions invoiceNumber={invoice.invoice_number} publicUrl={invoice.public_url || ''} />

            {/* Contenedor tipo A4 para la factura */}
            <div className="invoice-container" style={{
                maxWidth: 800,
                margin: '32px auto',
                background: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '48px 56px',
                color: '#111827',
            }}>
                {/* Header Factura */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: 24, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {professional?.logo_url ? (
                            <img src={professional.logo_url} alt="Logo" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', background: 'white', border: '1px solid #e5e7eb' }} />
                        ) : (
                            <div style={{
                                width: 60, height: 60, borderRadius: 12,
                                background: '#f3f4f6', border: '1px solid #e5e7eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, fontWeight: 700, color: '#9ca3af'
                            }}>
                                {(professional?.name || 'P')[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1f2937', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                FACTURA
                            </h1>
                            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                                {professional?.trade || invoice.trade}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 24 }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>De</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                                    {professional?.name || invoice.trade || 'Profesional'}
                                </div>
                                {professional?.trade && (
                                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{professional.trade}</div>
                                )}
                                {professional?.whatsapp_number && (
                                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>📱 {professional.whatsapp_number}</div>
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>N° Factura</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{invoice.invoice_number}</div>
                                
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginTop: 12 }}>Fecha</div>
                                <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{formatDate(invoice.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cliente Info */}
                <div style={{ marginBottom: 40, background: '#f9fafb', padding: 20, borderRadius: 8, border: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                        Facturar a
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                        {invoice.client_name || 'Consumidor Final'}
                    </div>
                    {invoice.client_address && (
                        <div style={{ fontSize: 14, color: '#4b5563', marginBottom: 2 }}>{invoice.client_address}</div>
                    )}
                    {invoice.client_phone && (
                        <div style={{ fontSize: 14, color: '#4b5563' }}>Tel: {invoice.client_phone}</div>
                    )}
                </div>

                {/* Tabla de Conceptos */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Descripción del Servicio</th>
                            <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', width: 140 }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Facturas directas con ítems dinámicos */}
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: '#111827' }}>{item.descripcion}</div>
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: 15, fontWeight: 500, color: '#111827' }}>
                                        {formatCurrency(item.monto)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            /* Facturas generadas desde presupuesto (comportamiento original) */
                            <>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{invoice.trade} (Mano de obra)</div>
                                        {invoice.description && (
                                            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                                {renderMarkdown(invoice.description)}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right', verticalAlign: 'top', fontSize: 15, fontWeight: 500, color: '#111827' }}>
                                        {formatCurrency(invoice.labor_amount)}
                                    </td>
                                </tr>
                                {invoice.materials_amount > 0 && (
                                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '16px 8px' }}>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Materiales</div>
                                            {invoice.materials_detail && (
                                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, whiteSpace: 'pre-wrap' }}>
                                                    {renderMarkdown(invoice.materials_detail)}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: 15, fontWeight: 500, color: '#111827' }}>
                                            {formatCurrency(invoice.materials_amount)}
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>

                {/* Totales */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
                    <div style={{ width: 320 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px', borderBottom: '1px solid #e5e7eb' }}>
                            <span style={{ fontSize: 14, color: '#6b7280' }}>Subtotal</span>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{formatCurrency(invoice.total_amount)}</span>
                        </div>
                        <div style={{ 
                            display: 'flex', justifyContent: 'space-between', padding: '16px 12px', 
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginTop: 12
                        }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>TOTAL</span>
                            <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{formatCurrency(invoice.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Firmas / Aprobación */}
                {(invoice.client_signature_name || invoice.client_signature_data) && (
                    <div style={{ borderTop: '2px dashed #e5e7eb', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 12, color: '#6b7280', maxWidth: 400 }}>
                            Esta factura fue generada a partir de un presupuesto aceptado y firmado de conformidad por el cliente.
                        </div>
                        <div style={{ textAlign: 'center', width: 200 }}>
                            {invoice.client_signature_data && (
                                <img src={invoice.client_signature_data} alt="Firma" style={{ height: 60, margin: '0 auto 8px', mixBlendMode: 'multiply' }} />
                            )}
                            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: 8, fontSize: 13, fontWeight: 600, color: '#4b5563' }}>
                                {invoice.client_signature_name || 'Firma del Cliente'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Global CSS para ocultar UI al imprimir */}
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none !important; }
                        .invoice-container { margin: 0 !important; padding: 0 !important; box-shadow: none !important; max-width: 100% !important; }
                        @page { margin: 1cm; size: A4 portrait; }
                    }
                `}} />
            </div>
        </div>
    )
}
