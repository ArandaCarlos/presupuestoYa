'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Receipt } from 'lucide-react'

export default function NewDocumentPage() {
    return (
        <div className="fade-in" style={{ maxWidth: 600 }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <Link
                    href="/dashboard"
                    className="btn btn-ghost btn-sm"
                    style={{ marginBottom: 14, paddingLeft: 0 }}
                >
                    <ArrowLeft size={16} /> Volver
                </Link>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>
                    ¿Qué querés crear?
                </h1>
                <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                    Elegí el tipo de documento que necesita tu cliente.
                </p>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Card Presupuesto */}
                <Link
                    href="/dashboard/quotes/new"
                    style={{ textDecoration: 'none' }}
                >
                    <div style={{
                        background: 'white',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 18,
                        padding: '28px 28px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 20,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-accent)'
                            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-200)'
                            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                        }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                            borderRadius: 14,
                            padding: 16,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FileText size={28} color="var(--brand-accent)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                marginBottom: 6
                            }}>
                                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
                                    Presupuesto
                                </span>
                                <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    background: '#eff6ff', color: 'var(--brand-accent)',
                                    padding: '3px 8px', borderRadius: 20,
                                    border: '1px solid #dbeafe'
                                }}>
                                    Recomendado
                                </span>
                            </div>
                            <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
                                Enviá una cotización antes de empezar el trabajo.
                                Tu cliente puede <strong style={{ color: 'var(--gray-700)' }}>aceptarlo con firma digital</strong> y
                                tenés validez configurable de 7, 14 o 30 días. Ideal para obras, reparaciones y servicios con precio a confirmar.
                            </p>
                            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand-accent)', fontSize: 13, fontWeight: 700 }}>
                                Crear presupuesto →
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Card Factura */}
                <Link
                    href="/dashboard/invoices/new"
                    style={{ textDecoration: 'none' }}
                >
                    <div style={{
                        background: 'white',
                        border: '2px solid var(--gray-200)',
                        borderRadius: 18,
                        padding: '28px 28px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 20,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = '#7c3aed'
                            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.12)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-200)'
                            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                        }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                            borderRadius: 14,
                            padding: 16,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Receipt size={28} color="#7c3aed" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 6 }}>
                                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
                                    Factura
                                </span>
                            </div>
                            <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
                                Emitís el cobro de un trabajo <strong style={{ color: 'var(--gray-700)' }}>ya realizado</strong>.
                                Cargás uno a uno los conceptos que cobrás (mano de obra, materiales, visita técnica, etc.)
                                y el total se calcula automáticamente. No requiere aceptación del cliente.
                            </p>
                            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: '#7c3aed', fontSize: 13, fontWeight: 700 }}>
                                Crear factura →
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <p style={{
                marginTop: 20,
                fontSize: 12,
                color: 'var(--gray-400)',
                textAlign: 'center'
            }}>
                Ambos documentos cuentan para tu cupo mensual.
            </p>
        </div>
    )
}
