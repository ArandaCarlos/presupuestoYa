'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, ChevronRight, Plus, Trash2, Receipt } from 'lucide-react'
import Link from 'next/link'

interface InvoiceItem {
    id: string
    descripcion: string
    monto: number | ''
}

interface PreviousClient {
    client_name: string
    client_phone: string | null
    client_address: string | null
}

function makeId() {
    return Math.random().toString(36).slice(2, 9)
}

function makeItem(): InvoiceItem {
    return { id: makeId(), descripcion: '', monto: '' }
}

// ──────────────────────────────────────────────────────────────
// ClientAutocomplete: busca en quotes + invoices del profesional
// ──────────────────────────────────────────────────────────────
function ClientAutocomplete({
    value,
    onChange,
    onSelect,
    professionalId,
    inputStyle,
}: {
    value: string
    onChange: (v: string) => void
    onSelect: (client: PreviousClient) => void
    professionalId: string | null
    inputStyle: React.CSSProperties
}) {
    const [suggestions, setSuggestions] = useState<PreviousClient[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!professionalId || value.trim().length < 1) {
            setSuggestions([])
            setOpen(false)
            return
        }

        const timeout = setTimeout(async () => {
            const supabase = createClient()
            const term = `%${value.trim()}%`

            // Buscar en quotes
            const { data: fromQuotes } = await supabase
                .from('quotes')
                .select('client_name, client_phone, address')
                .eq('professional_id', professionalId)
                .ilike('client_name', term)
                .not('client_name', 'is', null)
                .limit(5)

            // Buscar en invoices
            const { data: fromInvoices } = await supabase
                .from('invoices')
                .select('client_name, client_phone, client_address')
                .eq('professional_id', professionalId)
                .ilike('client_name', term)
                .not('client_name', 'is', null)
                .limit(5)

            // Combinar y deduplicar por nombre
            const seen = new Set<string>()
            const combined: PreviousClient[] = []

            for (const q of (fromQuotes || [])) {
                const key = q.client_name.toLowerCase()
                if (!seen.has(key)) {
                    seen.add(key)
                    combined.push({
                        client_name: q.client_name,
                        client_phone: q.client_phone ?? null,
                        client_address: q.address ?? null,
                    })
                }
            }
            for (const inv of (fromInvoices || [])) {
                const key = (inv.client_name as string).toLowerCase()
                if (!seen.has(key)) {
                    seen.add(key)
                    combined.push({
                        client_name: inv.client_name as string,
                        client_phone: inv.client_phone ?? null,
                        client_address: inv.client_address ?? null,
                    })
                }
            }

            setSuggestions(combined)
            setOpen(combined.length > 0)
        }, 200)

        return () => clearTimeout(timeout)
    }, [value, professionalId])

    return (
        <div style={{ position: 'relative' }}>
            <input
                style={inputStyle}
                placeholder="Ej: Juan García"
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                autoComplete="off"
            />
            {open && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                    background: 'white', borderRadius: 10, marginTop: 4,
                    border: '1.5px solid var(--gray-200)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            onMouseDown={() => {
                                onSelect(s)
                                setOpen(false)
                            }}
                            style={{
                                width: '100%', textAlign: 'left', padding: '10px 14px',
                                border: 'none', background: 'transparent',
                                borderBottom: i < suggestions.length - 1 ? '1px solid var(--gray-100)' : 'none',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2,
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#faf5ff'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                                {s.client_name}
                            </span>
                            {(s.client_phone || s.client_address) && (
                                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                                    {[s.client_phone, s.client_address].filter(Boolean).join(' · ')}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ──────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────
export default function NewInvoicePage() {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [checkingQuota, setCheckingQuota] = useState(true)
    const [quotaBlocked, setQuotaBlocked] = useState(false)
    const [quotaInfo, setQuotaInfo] = useState({ count: 0, plan: 'free' })
    const [professionalId, setProfessionalId] = useState<string | null>(null)

    // Step 1 data
    const [clientName, setClientName] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [clientAddress, setClientAddress] = useState('')
    const [tradeLabel, setTradeLabel] = useState('')
    const [description, setDescription] = useState('')

    // Step 2 data: items
    const [items, setItems] = useState<InvoiceItem[]>([makeItem()])

    // Check quota on mount
    useEffect(() => {
        const checkQuota = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setCheckingQuota(false); return }

            const { data: prof } = await supabase
                .from('professionals')
                .select('id, plan, monthly_quote_count, quota_reset_at')
                .eq('user_id', user.id)
                .maybeSingle()

            if (prof) {
                setProfessionalId(prof.id)
                const now = new Date()
                const resetAt = prof.quota_reset_at ? new Date(prof.quota_reset_at) : now
                const sameMonth =
                    now.getMonth() === resetAt.getMonth() &&
                    now.getFullYear() === resetAt.getFullYear()
                const currentCount = sameMonth ? prof.monthly_quote_count || 0 : 0

                setQuotaInfo({ count: currentCount, plan: prof.plan })
                if (prof.plan === 'free' && currentCount >= 5) {
                    setQuotaBlocked(true)
                }
            }
            setCheckingQuota(false)
        }
        checkQuota()
    }, [])

    // When client is selected from autocomplete, fill all fields
    const handleSelectClient = (client: PreviousClient) => {
        setClientName(client.client_name)
        setClientPhone(client.client_phone ?? '')
        setClientAddress(client.client_address ?? '')
    }

    // Items helpers
    const addItem = () => setItems(prev => [...prev, makeItem()])
    const removeItem = (id: string) => {
        if (items.length <= 1) return
        setItems(prev => prev.filter(i => i.id !== id))
    }
    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    const totalAmount = items.reduce((acc, i) => acc + (Number(i.monto) || 0), 0)
    const hasValidItems = items.some(i => i.descripcion.trim() && Number(i.monto) > 0)

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        const validItems = items
            .filter(i => i.descripcion.trim() && Number(i.monto) > 0)
            .map(i => ({ descripcion: i.descripcion.trim(), monto: Number(i.monto) }))

        try {
            const res = await fetch('/api/invoices/direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: clientName || undefined,
                    client_phone: clientPhone || undefined,
                    client_address: clientAddress || undefined,
                    description: description || undefined,
                    trade: tradeLabel || undefined,
                    items: validItems,
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al crear la factura')
                setLoading(false)
                return
            }

            router.push(`/p/factura/${data.invoiceId}`)
        } catch {
            setError('Error de conexión')
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid var(--gray-200)', borderRadius: 10,
        fontSize: 15, fontFamily: 'inherit', color: 'var(--gray-900)',
        background: 'white', outline: 'none', boxSizing: 'border-box'
    }

    if (checkingQuota) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <div className="spinner" />
            </div>
        )
    }

    if (quotaBlocked) {
        return (
            <div className="fade-in" style={{ maxWidth: 480 }}>
                <Link href="/dashboard/new" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 0 }}>
                    <ArrowLeft size={16} /> Volver
                </Link>
                <div style={{
                    background: 'linear-gradient(145deg, #1e3a8a, #2563eb)',
                    borderRadius: 24, padding: '40px 32px', textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(37,99,235,0.25)'
                }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10 }}>
                        Alcanzaste tu límite del mes
                    </h2>
                    <p style={{ color: 'white', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
                        Con el Plan Free podés crear hasta 5 documentos por mes (presupuestos + facturas).
                        ¡Pasate a PRO para crear ilimitados!
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 28 }}>
                        Usaste {quotaInfo.count} de 5 este mes.
                    </p>
                    <Link href="/dashboard/upgrade" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '14px 28px', borderRadius: 14, textDecoration: 'none',
                        background: 'white', fontSize: 16, fontWeight: 800, color: '#1e3a8a',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }}>
                        Pasarme al Pro — $10.000/mes →
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="fade-in" style={{ maxWidth: 600 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <Link href="/dashboard/new" className="btn btn-ghost btn-sm" style={{ marginBottom: 12, paddingLeft: 0 }}>
                    <ArrowLeft size={16} /> Volver
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        borderRadius: 10, padding: 8, display: 'flex'
                    }}>
                        <Receipt size={18} color="white" />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>
                        Nueva Factura
                    </h1>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{
                            flex: 1, height: 4, borderRadius: 4,
                            background: s <= step ? '#7c3aed' : 'var(--gray-200)',
                            transition: 'background 0.3s'
                        }} />
                    ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>
                    Paso {step} de 2 — {['Datos del cliente', 'Ítems a facturar'][step - 1]}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    background: '#fee2e2', borderRadius: 12, padding: '14px 16px',
                    fontSize: 14, color: '#dc2626', marginBottom: 20,
                    border: '1.5px solid #fecaca'
                }}>
                    ⚠ {error}
                </div>
            )}

            {/* PASO 1: Cliente */}
            {step === 1 && (
                <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        👤 Datos del cliente <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-400)' }}>(opcionales)</span>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Nombre del cliente</label>
                        {/* Autocomplete que busca en quotes + invoices */}
                        <ClientAutocomplete
                            value={clientName}
                            onChange={setClientName}
                            onSelect={handleSelectClient}
                            professionalId={professionalId}
                            inputStyle={inputStyle}
                        />
                        {clientName && (
                            <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 4 }}>
                                💡 Si ya trabajaste con este cliente, aparecerán sugerencias debajo.
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">WhatsApp del cliente</label>
                        <input style={inputStyle} placeholder="+5491155......"
                            value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Dirección</label>
                        <input style={inputStyle} placeholder="Ej: Av. Corrientes 1234, CABA"
                            value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Tipo de servicio <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(ej: Electricidad, Plomería)</span></label>
                        <input style={inputStyle} placeholder="Ej: Instalación eléctrica"
                            value={tradeLabel} onChange={e => setTradeLabel(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Descripción general <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
                            placeholder="Detallá brevemente el trabajo realizado..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary btn-lg" style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                        onClick={() => setStep(2)}>
                        Continuar <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* PASO 2: Ítems */}
            {step === 2 && (
                <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        🧾 Ítems a facturar
                        {clientName && (
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 8 }}>
                                para {clientName}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {items.map((item, index) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'flex-start',
                                padding: '14px',
                                background: 'var(--gray-50)',
                                borderRadius: 12,
                                border: '1.5px solid var(--gray-200)'
                            }}>
                                {/* Item number */}
                                <div style={{
                                    minWidth: 26, height: 26, borderRadius: '50%',
                                    background: '#7c3aed', color: 'white',
                                    fontSize: 12, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, marginTop: 2
                                }}>
                                    {index + 1}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <input
                                        style={{ ...inputStyle, background: 'white' }}
                                        placeholder="Ej: Mano de obra, Materiales, Visita técnica..."
                                        value={item.descripcion}
                                        onChange={e => updateItem(item.id, 'descripcion', e.target.value)}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-500)', flexShrink: 0 }}>$</span>
                                        <input
                                            type="number"
                                            style={{ ...inputStyle, background: 'white', flex: 1 }}
                                            placeholder="0"
                                            value={item.monto === '' ? '' : item.monto}
                                            min={0}
                                            onChange={e => updateItem(item.id, 'monto', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    disabled={items.length <= 1}
                                    style={{
                                        background: items.length <= 1 ? 'var(--gray-100)' : '#fee2e2',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: '8px',
                                        cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <Trash2 size={16} color={items.length <= 1 ? 'var(--gray-300)' : '#dc2626'} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Item Button */}
                    <button
                        type="button"
                        onClick={addItem}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            border: '2px dashed var(--gray-300)',
                            borderRadius: 12, padding: '12px',
                            background: 'transparent',
                            color: 'var(--gray-500)',
                            fontSize: 14, fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = '#7c3aed'
                            ;(e.currentTarget as HTMLElement).style.color = '#7c3aed'
                            ;(e.currentTarget as HTMLElement).style.background = '#faf5ff'
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-300)'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--gray-500)'
                            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                    >
                        <Plus size={16} /> Agregar ítem
                    </button>

                    {/* Total preview */}
                    {totalAmount > 0 && (
                        <div style={{
                            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                            borderRadius: 14, padding: '20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>TOTAL FACTURA</span>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: 26 }}>
                                ${totalAmount.toLocaleString('es-AR')}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                            ← Atrás
                        </button>
                        <button
                            style={{
                                flex: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '12px 20px', borderRadius: 12,
                                background: hasValidItems && !loading
                                    ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                                    : 'var(--gray-200)',
                                color: hasValidItems && !loading ? 'white' : 'var(--gray-400)',
                                border: 'none',
                                fontSize: 15, fontWeight: 700,
                                cursor: hasValidItems && !loading ? 'pointer' : 'not-allowed',
                                boxShadow: hasValidItems && !loading ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                                transition: 'all 0.2s'
                            }}
                            onClick={handleSubmit}
                            disabled={loading || !hasValidItems}
                        >
                            {loading
                                ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Creando...</>
                                : <><Save size={16} /> Crear Factura</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
