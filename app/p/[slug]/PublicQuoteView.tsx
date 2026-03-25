'use client'

import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { createClient } from '@/lib/supabase/client'
import type { Quote } from '@/lib/types'
import { CheckCircle, XCircle, MessageCircle, Clock, MapPin, Wrench, Calendar, ChevronDown, ChevronUp, Printer } from 'lucide-react'

interface Props {
    quote: Quote
}

function formatCurrency(amount: number) {
    return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric'
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

function StatusBanner({ status }: { status: string }) {
    if (status === 'accepted') {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #15803d, #16a34a)',
                color: 'white',
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
            }}>
                <CheckCircle size={20} />
                ¡Presupuesto aceptado! El profesional fue notificado.
            </div>
        )
    }
    if (status === 'rejected') {
        return (
            <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '16px 24px',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
            }}>
                <XCircle size={20} />
                Presupuesto rechazado.
            </div>
        )
    }
    return null
}

export default function PublicQuoteView({ quote }: Props) {
    const [status, setStatus] = useState(quote.status)
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showAcceptModal, setShowAcceptModal] = useState(false)
    const [signatureName, setSignatureName] = useState('')
    const [signatureError, setSignatureError] = useState('')
    const sigCanvas = useRef<SignatureCanvas>(null)

    const professional = quote.professionals as any
    const isExpired = quote.expires_at && new Date(quote.expires_at) < new Date()
    const canAct = status === 'viewed' || status === 'sent'

    const handleAccept = async () => {
        if (!signatureName.trim()) {
            setSignatureError('Por favor completá tu nombre.')
            return
        }
        if (sigCanvas.current?.isEmpty()) {
            setSignatureError('Por favor realizá tu firma en el recuadro.')
            return
        }
        setSignatureError('')
        setLoading('accept')
        
        const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png')
        
        const supabase = createClient()
        await supabase
            .from('quotes')
            .update({ 
                status: 'accepted', 
                accepted_at: new Date().toISOString(),
                client_signature_name: signatureName.trim(),
                client_signature_data: signatureData || null,
                client_signature_date: new Date().toISOString()
            })
            .eq('slug', quote.slug)
            
        // Reflejar localmente para la UI sin recargar
        quote.client_signature_name = signatureName.trim()
        quote.client_signature_data = signatureData || null
        
        setStatus('accepted')
        setLoading(null)
        setShowAcceptModal(false)

        // Enviar notificación por email al profesional (sin bloquear la UI)
        fetch(`/api/quotes/${quote.slug}/accept-notify`, { method: 'POST' })
            .catch(err => console.error('Error enviando notificación:', err))
    }

    const handleReject = async () => {
        setLoading('reject')
        const supabase = createClient()
        await supabase
            .from('quotes')
            .update({ status: 'rejected', rejected_at: new Date().toISOString() })
            .eq('slug', quote.slug)
        setStatus('rejected')
        setLoading(null)
        setShowRejectModal(false)
    }

    const handlePrint = () => {
        window.print()
    }

    const whatsappUrl = professional?.whatsapp_number
        ? `https://wa.me/${professional.whatsapp_number.replace(/\D/g, '')}?text=Hola! Vi el presupuesto %23${quote.slug.toUpperCase()} y quiero consultar algo.`
        : null

    return (
        <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
            {/* Status banner */}
            <StatusBanner status={status} />

            {/* Float actions for print/download */}
            <div className="no-print" style={{ 
                background: 'white', 
                borderBottom: '1px solid var(--gray-200)', 
                padding: '12px 16px',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                display: 'flex',
                justifyContent: 'center',
                gap: 12
            }}>
                <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
                    <Printer size={16} /> Descargar PDF
                </button>
            </div>

            {/* Header profesional */}
            <div style={{
                background: 'linear-gradient(135deg, var(--brand-blue) 0%, #1e40af 100%)',
                padding: '28px 24px 24px',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                        {professional?.logo_url ? (
                            <img
                                src={professional.logo_url}
                                alt="Logo"
                                style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'white' }}
                            />
                        ) : (
                            <div style={{
                                width: 52, height: 52, borderRadius: 12,
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 22, fontWeight: 700, color: 'white'
                            }}>
                                {(professional?.name || 'P')[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>
                                {professional?.name || 'Profesional'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                {professional?.trade || quote.trade}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: 8, padding: '6px 12px',
                            fontSize: 12, color: 'rgba(255,255,255,0.85)'
                        }}>
                            Presupuesto #{quote.slug.toUpperCase()}
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: 8, padding: '6px 12px',
                            fontSize: 12, color: 'rgba(255,255,255,0.85)',
                            display: 'flex', alignItems: 'center', gap: 4
                        }}>
                            <Calendar size={12} />
                            Válido hasta: {formatDate(quote.expires_at)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 40px' }}>

                {/* Trabajo */}
                <div className="card fade-in" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Wrench size={16} color="var(--brand-accent)" />
                        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-400)' }}>
                            Trabajo a realizar
                        </span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        {quote.trade}
                    </div>
                    {quote.description && (
                        <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {renderMarkdown(quote.description)}
                        </div>
                    )}
                    {quote.address && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            marginTop: 10, fontSize: 13, color: 'var(--gray-500)'
                        }}>
                            <MapPin size={14} color="var(--gray-400)" />
                            {quote.address}
                        </div>
                    )}
                </div>

                {/* Detalle de precios */}
                <div className="card fade-in" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--gray-400)' }}>
                            Detalle del presupuesto
                        </span>
                        <button
                            onClick={() => setShowDetail(!showDetail)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                        >
                            {showDetail ? 'Ocultar' : 'Ver detalle'} {showDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    {/* Filas */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                            <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>
                                Mano de obra
                                {showDetail && quote.labor_description && (
                                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{quote.labor_description}</div>
                                )}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                                {formatCurrency(quote.labor_amount)}
                            </span>
                        </div>

                        {quote.materials_included && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                                <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>
                                    Materiales
                                    {showDetail && quote.materials_detail && (
                                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2, whiteSpace: 'pre-wrap' }}>{quote.materials_detail}</div>
                                    )}
                                </span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                                    {formatCurrency(quote.materials_amount)}
                                </span>
                            </div>
                        )}

                        {!quote.materials_included && (
                            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                                <span style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>
                                    * Materiales no incluidos en este presupuesto
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginTop: 16,
                        background: 'linear-gradient(135deg, var(--brand-blue), #1e40af)',
                        borderRadius: 12, padding: '16px 20px'
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 15 }}>TOTAL</span>
                        <span style={{ color: 'white', fontWeight: 800, fontSize: 26 }}>
                            {formatCurrency(quote.total_amount)}
                        </span>
                    </div>

                    {/* Vigencia */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        marginTop: 12, fontSize: 12, color: 'var(--gray-400)'
                    }}>
                        <Clock size={12} />
                        Vigencia: {quote.validity_days} días a partir de la fecha de emisión
                        {isExpired && <span className="badge badge-red" style={{ marginLeft: 4 }}>Vencido</span>}
                    </div>
                </div>

                {/* Acciones */}
                {canAct && !isExpired && (
                    <div className="no-print fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <button
                            className="btn btn-green"
                            style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: 17, borderRadius: 14 }}
                            onClick={() => setShowAcceptModal(true)}
                            disabled={loading !== null}
                        >
                            <CheckCircle size={20} /> ACEPTAR Y FIRMAR
                        </button>

                        <div style={{ display: 'flex', gap: 10 }}>
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                                >
                                    <MessageCircle size={16} color="#25D366" />
                                    Solicitar cambios
                                </a>
                            )}
                            <button
                                className="btn btn-danger"
                                style={{ flex: whatsappUrl ? 1 : 'auto', justifyContent: 'center', padding: '12px' }}
                                onClick={() => setShowRejectModal(true)}
                                disabled={loading !== null}
                            >
                                <XCircle size={16} />
                                Rechazar
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)' }}>
                            Al aceptar, el profesional recibirá una notificación inmediata.
                        </p>
                    </div>
                )}

                {/* Estado aceptado */}
                {status === 'accepted' && (
                    <div className="card fade-in" style={{ textAlign: 'center', borderColor: '#86efac', background: '#f0fdf4' }}>
                        <CheckCircle size={40} color="var(--brand-green)" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-green)', marginBottom: 6 }}>
                            ¡Acuerdo Firmado!
                        </div>
                        {quote.client_signature_name && (
                            <div style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 12, fontWeight: 500 }}>
                                Firmado por: {quote.client_signature_name}
                            </div>
                        )}
                        {quote.client_signature_data && (
                            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 8, padding: 16, display: 'inline-block', marginBottom: 16 }}>
                                <img src={quote.client_signature_data} alt="Firma del cliente" style={{ maxHeight: 80, maxWidth: '100%' }} />
                            </div>
                        )}
                        <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                            El profesional fue notificado. Vas a recibir
                            confirmación de contacto a la brevedad.
                        </div>
                    </div>
                )}

                {/* Estado rechazado */}
                {status === 'rejected' && (
                    <div className="card fade-in" style={{ textAlign: 'center', borderColor: '#fecaca', background: '#fff5f5' }}>
                        <XCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>
                            Presupuesto rechazado
                        </div>
                        {whatsappUrl && (
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                                <MessageCircle size={14} color="#25D366" />
                                Contactar al profesional
                            </a>
                        )}
                    </div>
                )}

                {/* Expirado */}
                {isExpired && status !== 'accepted' && (
                    <div className="card fade-in" style={{ textAlign: 'center', borderColor: 'var(--gray-200)' }}>
                        <Clock size={40} color="var(--gray-400)" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6 }}>
                            Este presupuesto venció
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>
                            Pedile al profesional que te genere uno nuevo.
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--gray-400)' }}>
                    Generado con{' '}
                    <a href="/" style={{ color: 'var(--brand-accent)', fontWeight: 600, textDecoration: 'none' }}>PresupuestosYA</a>
                    {' '}{"— Presupuestos profesionales en 60 segundos"}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .card { border: none !important; box-shadow: none !important; padding: 0 !important; margin-bottom: 24px !important; }
                    body > div { background: white !important; }
                    @page { margin: 1.5cm; size: A4 portrait; }
                }
            `}} />

            {/* Modal Rechazar */}
            {showRejectModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    zIndex: 50, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '20px 20px 0 0',
                        padding: '28px 24px', width: '100%', maxWidth: 600
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>¿Rechazar el presupuesto?</h3>
                        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
                            Si querés cambios, es mejor usar &quot;Solicitar cambios&quot; para hablar con el profesional.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                                onClick={handleReject}
                                disabled={loading !== null}
                            >
                                {loading === 'reject' ? 'Procesando...' : 'Sí, rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Aceptar / Firmar */}
            {showAcceptModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    zIndex: 50, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '20px 20px 0 0',
                        padding: '24px', width: '100%', maxWidth: 600,
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--gray-900)' }}>
                            Firma del Acuerdo
                        </h3>
                        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.5 }}>
                            Para confirmar formalmente este presupuesto, completá tus datos y realizá tu firma.
                        </p>
                        
                        {signatureError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
                                {signatureError}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                                    Nombre y Apellido
                                </label>
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Ej: Juan Perez"
                                    value={signatureName}
                                    onChange={e => setSignatureName(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
                                        Tu firma manuscrita
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={() => sigCanvas.current?.clear()}
                                        style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Borrar
                                    </button>
                                </div>
                                <div style={{ border: '2px dashed var(--gray-300)', borderRadius: 12, background: 'var(--gray-50)', overflow: 'hidden' }}>
                                    <SignatureCanvas 
                                        ref={sigCanvas} 
                                        penColor="#0f172a"
                                        canvasProps={{ 
                                            width: 500,
                                            height: 180,
                                            className: 'sigCanvas',
                                            style: { width: '100%', height: 180, cursor: 'crosshair', touchAction: 'none' }
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: 14 }}
                                onClick={() => setShowAcceptModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-green"
                                style={{ flex: 1, padding: 14 }}
                                onClick={handleAccept}
                                disabled={loading !== null}
                            >
                                {loading === 'accept' ? 'Procesando...' : 'Firmar y aceptar'}
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--gray-400)', marginTop: 16 }}>
                            Al firmar, estás aceptando formalmente los términos, precios y alcance detallados en este documento para la realización del trabajo.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
