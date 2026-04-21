'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, ArrowLeft, ChevronRight, Sparkles, Copy } from 'lucide-react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────
// ClientAutocomplete: busca clientes previos en quotes + invoices
// ─────────────────────────────────────────────────────────────────
interface PreviousClient { client_name: string; client_phone: string | null; client_address: string | null }

function ClientAutocomplete({
    value, onChange, onSelect, professionalId, inputStyle,
}: {
    value: string
    onChange: (v: string) => void
    onSelect: (c: PreviousClient) => void
    professionalId: string | null
    inputStyle: React.CSSProperties
}) {
    const [suggestions, setSuggestions] = useState<PreviousClient[]>([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!professionalId || value.trim().length < 1) { setSuggestions([]); setOpen(false); return }
        const timer = setTimeout(async () => {
            const supabase = createClient()
            const term = `%${value.trim()}%`
            const { data: fromQ } = await supabase.from('quotes').select('client_name, client_phone, address')
                .eq('professional_id', professionalId).ilike('client_name', term).not('client_name', 'is', null).limit(5)
            const { data: fromI } = await supabase.from('invoices').select('client_name, client_phone, client_address')
                .eq('professional_id', professionalId).ilike('client_name', term).not('client_name', 'is', null).limit(5)
            const seen = new Set<string>()
            const combined: PreviousClient[] = []
            for (const q of (fromQ || [])) {
                const k = (q.client_name as string).toLowerCase()
                if (!seen.has(k)) { seen.add(k); combined.push({ client_name: q.client_name as string, client_phone: q.client_phone ?? null, client_address: q.address ?? null }) }
            }
            for (const i of (fromI || [])) {
                const k = (i.client_name as string).toLowerCase()
                if (!seen.has(k)) { seen.add(k); combined.push({ client_name: i.client_name as string, client_phone: i.client_phone ?? null, client_address: i.client_address ?? null }) }
            }
            setSuggestions(combined); setOpen(combined.length > 0)
        }, 200)
        return () => clearTimeout(timer)
    }, [value, professionalId])

    return (
        <div style={{ position: 'relative' }}>
            <input style={inputStyle} placeholder="Ej: Juan García" value={value}
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
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden'
                }}>
                    {suggestions.map((s, i) => (
                        <button key={i} type="button" onMouseDown={() => { onSelect(s); setOpen(false) }}
                            style={{
                                width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none',
                                background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2,
                                borderBottom: i < suggestions.length - 1 ? '1px solid var(--gray-100)' : 'none',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#eff6ff'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{s.client_name}</span>
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

const TRADES = [
    'Instalación eléctrica', 'Plomería y desagüe', 'Gas y calefacción',
    'Pintura interior', 'Pintura exterior', 'Carpintería',
    'Albañilería y refacciones', 'Limpieza profesional', 'Jardinería',
    'Aire acondicionado', 'Mudanza', 'Otro'
]

function NewQuoteForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const fromId = searchParams.get('from')

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loadingOriginal, setLoadingOriginal] = useState(!!fromId)
    const [error, setError] = useState('')
    const [improvingAI, setImprovingAI] = useState(false)
    const [aiError, setAiError] = useState('')
    const [isDuplicate, setIsDuplicate] = useState(false)
    const [quotaBlocked, setQuotaBlocked] = useState(false)
    const [quotaInfo, setQuotaInfo] = useState({ count: 0, plan: 'free' })
    const [checkingQuota, setCheckingQuota] = useState(true)
    const [professionalId, setProfessionalId] = useState<string | null>(null)

    const [form, setForm] = useState({
        client_name: '',
        client_phone: '',
        trade: '',
        tradeCustom: '',
        address: '',
        description: '',
        materials_included: false,
        materials_detail: '',
        materials_amount: 0,
        labor_description: '',
        labor_amount: 0,
        validity_days: 7,
    })

    // Verificar quota al montar
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
                    const isPlanFree = prof.plan === 'free'
                    const now = new Date()
                    const resetAt = prof.quota_reset_at ? new Date(prof.quota_reset_at) : now
                    const sameMonth = now.getMonth() === resetAt.getMonth() && now.getFullYear() === resetAt.getFullYear()
                    const currentCount = sameMonth ? (prof.monthly_quote_count || 0) : 0

                    setQuotaInfo({ count: currentCount, plan: prof.plan })
                    if (isPlanFree && currentCount >= 5) {
                        setQuotaBlocked(true)
                    }
                }
            setCheckingQuota(false)
        }
        checkQuota()
    }, [])

    // Si viene con ?from=ID, cargar los datos del presupuesto original
    useEffect(() => {
        if (!fromId) return
        const load = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('quotes')
                .select('*')
                .eq('id', fromId)
                .single()

            if (data) {
                setIsDuplicate(true)
                const tradeInList = TRADES.includes(data.trade)
                setForm({
                    client_name: data.client_name || '',
                    client_phone: data.client_phone || '',
                    trade: tradeInList ? data.trade : 'Otro',
                    tradeCustom: tradeInList ? '' : data.trade,
                    address: data.address || '',
                    description: data.description || '',
                    materials_included: data.materials_included || false,
                    materials_detail: data.materials_detail || '',
                    materials_amount: data.materials_amount || 0,
                    labor_description: data.labor_description || '',
                    labor_amount: data.labor_amount || 0,
                    validity_days: data.validity_days || 7,
                })
            }
            setLoadingOriginal(false)
        }
        load()
    }, [fromId])

    const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

    const handleImproveWithAI = async () => {
        if (!form.description || form.description.trim().length < 5) return
        setImprovingAI(true)
        setAiError('')
        try {
            const res = await fetch('/api/improve-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: form.description })
            })
            const data = await res.json()
            if (data.improved) {
                set('description', data.improved)
            } else {
                setAiError(data.error || 'No se pudo mejorar el texto')
            }
        } catch {
            setAiError('Error de conexión con la IA')
        } finally {
            setImprovingAI(false)
        }
    }

    const totalAmount = (form.labor_amount || 0) + (form.materials_included ? (form.materials_amount || 0) : 0)

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const tradeValue = form.trade === 'Otro' ? form.tradeCustom : form.trade
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    trade: tradeValue
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al guardar el presupuesto')
                setLoading(false)
                return
            }

            // Meta Pixel: StartTrial si el backend retorna eventId
            if (data.eventId && typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'StartTrial', {}, { eventId: data.eventId });
            }

            router.push(`/dashboard/quotes/${data.quote.id}?new=1`)
        } catch (err) {
            setError('Error de conexión al guardar el presupuesto')
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid var(--gray-200)', borderRadius: 10,
        fontSize: 15, fontFamily: 'inherit', color: 'var(--gray-900)',
        background: 'white', outline: 'none'
    }

    // Cargando quota
    if (checkingQuota) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <div className="spinner" />
            </div>
        )
    }

    // Límite del plan free alcanzado
    if (quotaBlocked) {
        return (
            <div className="fade-in" style={{ maxWidth: 480 }}>
                <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 0 }}>
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
                        Con el Plan Free podés crear hasta 5 presupuestos por mes.
                        ¡Pasate a PRO para crear ilimitados y acceder a métricas avanzadas!
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 28 }}>
                        Usaste {quotaInfo.count} de 5 este mes. El contador se resetea el 1° del mes.
                    </p>

                    <Link href="/dashboard/upgrade" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '14px 28px', borderRadius: 14, textDecoration: 'none',
                        background: 'white', fontSize: 16, fontWeight: 800, color: '#1e3a8a',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }}>
                        Pasarme al Pro — $10.000/mes →
                    </Link>

                    <div style={{ marginTop: 20 }}>
                        <Link href="/pricing" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                            Ver comparativa de planes
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (loadingOriginal) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, gap: 12 }}>
                <div className="spinner" />
                <span style={{ color: 'var(--gray-400)', fontSize: 14 }}>Cargando presupuesto original...</span>
            </div>
        )
    }

    return (
        <div className="fade-in" style={{ maxWidth: 600 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <Link href={fromId ? `/dashboard/quotes/${fromId}` : '/dashboard'} className="btn btn-ghost btn-sm" style={{ marginBottom: 12, paddingLeft: 0 }}>
                    <ArrowLeft size={16} /> Volver
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>
                        {isDuplicate ? 'Editar y reenviar' : 'Nuevo presupuesto'}
                    </h1>
                    {isDuplicate && (
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: '#fef9c3', color: '#a16207',
                            fontSize: 12, fontWeight: 600, padding: '4px 10px',
                            borderRadius: 20, border: '1px solid #fde68a'
                        }}>
                            <Copy size={11} /> Duplicado del original
                        </span>
                    )}
                </div>

                {isDuplicate && (
                    <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>
                        Los datos están pre-cargados del presupuesto anterior. Modificá lo que necesites y creá uno nuevo.
                    </p>
                )}

                {/* Steps */}
                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1, height: 4, borderRadius: 4,
                            background: s <= step ? 'var(--brand-accent)' : 'var(--gray-200)',
                            transition: 'background 0.3s'
                        }} />
                    ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>
                    Paso {step} de 3 — {['Datos del cliente', 'Detalles del trabajo', 'Precios'][step - 1]}
                </div>
            </div>

            {error && (
                <div style={{
                    background: '#fee2e2', borderRadius: 12, padding: '16px',
                    fontSize: 14, color: '#dc2626', marginBottom: 20,
                    border: '1.5px solid #fecaca',
                    display: 'flex', flexDirection: 'column', gap: 8
                }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        ⚠ {error}
                    </div>
                    {error.includes('Límite') && (
                        <Link href="/dashboard/upgrade" style={{ 
                            color: '#b91c1c', 
                            textDecoration: 'none', 
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 4,
                            background: '#fff',
                            padding: '10px 14px',
                            borderRadius: 10,
                            width: 'fit-content',
                            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.1)'
                        }}>
                             <Sparkles size={16} /> Pasate a PRO para tener presupuestos ilimitados →
                        </Link>
                    )}
                </div>
            )}

            {/* PASO 1: Cliente */}
            {step === 1 && (
                <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        👤 Datos del cliente
                    </div>

                    <div className="input-group">
                        <label className="input-label">Nombre del cliente <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                        <ClientAutocomplete
                            value={form.client_name}
                            onChange={v => set('client_name', v)}
                            onSelect={c => {
                                set('client_name', c.client_name)
                                if (c.client_phone) set('client_phone', c.client_phone)
                            }}
                            professionalId={professionalId}
                            inputStyle={inputStyle}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">WhatsApp del cliente <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                        <input style={inputStyle} placeholder="+5491155......"
                            value={form.client_phone} onChange={e => set('client_phone', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Tipo de trabajo *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {TRADES.map(t => (
                                <button key={t} type="button" onClick={() => set('trade', t)}
                                    style={{
                                        padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                        border: form.trade === t ? '2px solid var(--brand-accent)' : '1.5px solid var(--gray-200)',
                                        background: form.trade === t ? '#eff6ff' : 'white',
                                        color: form.trade === t ? 'var(--brand-accent)' : 'var(--gray-700)',
                                    }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                        {form.trade === 'Otro' && (
                            <input style={{ ...inputStyle, marginTop: 8 }} placeholder="Descripción del trabajo"
                                value={form.tradeCustom} onChange={e => set('tradeCustom', e.target.value)} />
                        )}
                    </div>

                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
                        onClick={() => setStep(2)}
                        disabled={!form.trade || (form.trade === 'Otro' && !form.tradeCustom)}>
                        Continuar <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* PASO 2: Detalles del trabajo */}
            {step === 2 && (
                <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        🔧 Detalles del trabajo
                    </div>

                    <div className="input-group">
                        <label className="input-label">Dirección <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                        <input style={inputStyle} placeholder="Ej: Av. Corrientes 1234, CABA"
                            value={form.address} onChange={e => set('address', e.target.value)} />
                    </div>

                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <label className="input-label" style={{ margin: 0 }}>Descripción del trabajo <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                            <button
                                type="button"
                                onClick={handleImproveWithAI}
                                disabled={improvingAI || !form.description || form.description.trim().length < 5}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '5px 12px', borderRadius: 20,
                                    border: 'none', cursor: 'pointer',
                                    fontSize: 12, fontWeight: 600,
                                    background: improvingAI ? 'var(--gray-100)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                    color: improvingAI ? 'var(--gray-400)' : 'white',
                                    transition: 'all 0.2s',
                                    opacity: (!form.description || form.description.trim().length < 5) ? 0.4 : 1,
                                    boxShadow: improvingAI ? 'none' : '0 2px 8px rgb(79 70 229 / 0.35)'
                                }}
                            >
                                {improvingAI
                                    ? <><div className="spinner" style={{ width: 12, height: 12, borderTopColor: '#7c3aed', borderWidth: 2 }} /> Mejorando...</>
                                    : <><Sparkles size={12} /> Mejorar con IA</>}
                            </button>
                        </div>
                        <textarea
                            style={{
                                ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6,
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                ...(improvingAI ? { opacity: 0.6, background: 'var(--gray-50)' } : {})
                            }}
                            placeholder="Detallá qué incluye el trabajo... (cuanto más detallado, mejor lo mejora la IA)"
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            disabled={improvingAI}
                        />
                        {aiError && (
                            <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
                                ⚠ {aiError} — verificá que tengas una API key configurada en .env.local
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>¿Los materiales están incluidos?</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {[true, false].map(v => (
                                <button key={String(v)} type="button"
                                    onClick={() => set('materials_included', v)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                        border: form.materials_included === v ? '2px solid var(--brand-accent)' : '1.5px solid var(--gray-200)',
                                        background: form.materials_included === v ? '#eff6ff' : 'white',
                                        color: form.materials_included === v ? 'var(--brand-accent)' : 'var(--gray-500)',
                                    }}>
                                    {v ? '✅ Sí, incluidos' : '❌ No incluidos'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.materials_included && (
                        <div className="input-group fade-in">
                            <label className="input-label">Detalle de materiales <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                                placeholder="Ej: Cable 2.5mm × 20m, Tomacorrientes × 3..."
                                value={form.materials_detail} onChange={e => set('materials_detail', e.target.value)} />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                            ← Atrás
                        </button>
                        <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>
                            Continuar <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 3: Precios */}
            {step === 3 && (
                <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                        💰 Precios y vigencia
                    </div>

                    <div className="input-group">
                        <label className="input-label">Mano de obra ($) *</label>
                        <input type="number" style={inputStyle} placeholder="Ej: 50000"
                            value={form.labor_amount || ''} onChange={e => set('labor_amount', parseFloat(e.target.value) || 0)} />
                    </div>

                    {form.materials_included && (
                        <div className="input-group fade-in">
                            <label className="input-label">Costo de materiales ($)</label>
                            <input type="number" style={inputStyle} placeholder="Ej: 12500"
                                value={form.materials_amount || ''} onChange={e => set('materials_amount', parseFloat(e.target.value) || 0)} />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Vigencia del presupuesto</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[7, 14, 30].map(d => (
                                <button key={d} type="button" onClick={() => set('validity_days', d)}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                        border: form.validity_days === d ? '2px solid var(--brand-accent)' : '1.5px solid var(--gray-200)',
                                        background: form.validity_days === d ? '#eff6ff' : 'white',
                                        color: form.validity_days === d ? 'var(--brand-accent)' : 'var(--gray-500)',
                                    }}>
                                    {d} días
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumen total */}
                    {totalAmount > 0 && (
                        <div style={{
                            background: 'linear-gradient(135deg, var(--brand-blue), #1e40af)',
                            borderRadius: 14, padding: '20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>TOTAL DEL PRESUPUESTO</span>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: 26 }}>
                                ${totalAmount.toLocaleString('es-AR')}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                            ← Atrás
                        </button>
                        <button className="btn btn-primary" style={{ flex: 2 }}
                            onClick={handleSubmit}
                            disabled={loading || form.labor_amount <= 0}>
                            {loading
                                ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Guardando...</>
                                : <><Save size={16} /> {isDuplicate ? 'Crear y reenviar' : 'Crear presupuesto'}</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function NewQuotePage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <div className="spinner" />
            </div>
        }>
            <NewQuoteForm />
        </Suspense>
    )
}
