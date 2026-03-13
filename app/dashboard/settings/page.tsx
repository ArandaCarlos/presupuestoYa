'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, User, Wrench, Phone, ImagePlus, CheckCircle } from 'lucide-react'

const TRADES = [
    'Electricista', 'Plomero', 'Gasista', 'Pintor', 'Carpintero',
    'Albañil', 'Limpieza profesional', 'Jardinero', 'Aire acondicionado',
    'Herrería', 'Mudanzas', 'Otro'
]

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        name: '',
        trade: '',
        whatsapp_number: '',
        logo_url: '',
        plan: 'free',
    })

    const supabase = createClient()

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Buscar perfil por user_id
            const { data: prof } = await supabase
                .from('professionals')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle()

            if (prof) {
                setForm({
                    name: prof.name || '',
                    trade: prof.trade || '',
                    whatsapp_number: prof.whatsapp_number || '',
                    logo_url: prof.logo_url || '',
                    plan: prof.plan || 'free',
                })
            }
            setLoading(false)
        }
        loadProfile()
    }, [])

    const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

    const handleSave = async () => {
        setSaving(true)
        setError('')
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error: upsertError } = await supabase
            .from('professionals')
            .upsert({
                user_id: user.id,
                whatsapp_number: form.whatsapp_number || user.email || user.id,
                name: form.name || null,
                trade: form.trade || null,
                logo_url: form.logo_url || null,
            }, { onConflict: 'user_id' })

        if (upsertError) {
            setError('No se pudo guardar el perfil. Intentá de nuevo.')
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid var(--gray-200)', borderRadius: 10,
        fontSize: 15, fontFamily: 'inherit', color: 'var(--gray-900)',
        background: 'white', outline: 'none'
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="fade-in" style={{ maxWidth: 560 }}>
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>Mi perfil</h1>
                    {form.plan === 'pro' && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 12, fontWeight: 700,
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white', padding: '4px 10px', borderRadius: 20
                        }}>
                            Plan PRO
                        </span>
                    )}
                </div>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
                    Esta información aparece en los presupuestos que enviás a tus clientes.
                </p>
            </div>

            {error && (
                <div style={{
                    background: '#fee2e2', borderRadius: 10, padding: '12px 16px',
                    fontSize: 13, color: '#dc2626', marginBottom: 16
                }}>{error}</div>
            )}

            {saved && (
                <div style={{
                    background: '#dcfce7', borderRadius: 10, padding: '12px 16px',
                    fontSize: 13, color: '#15803d', marginBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <CheckCircle size={16} /> Perfil guardado correctamente
                </div>
            )}

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Preview del encabezado del presupuesto */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--brand-blue), #1e40af)',
                    borderRadius: 12, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 12
                }}>
                    {form.logo_url ? (
                        <img src={form.logo_url} alt="Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', background: 'white' }} />
                    ) : (
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, fontWeight: 700, color: 'white'
                        }}>
                            {(form.name || '?')[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                            {form.name || 'Tu nombre'}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                            {form.trade || 'Tu oficio'}
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        Preview del presupuesto
                    </div>
                </div>

                {/* Nombre */}
                <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} color="var(--gray-400)" /> Nombre completo *
                    </label>
                    <input style={inputStyle} placeholder="Ej: Juan García"
                        value={form.name} onChange={e => set('name', e.target.value)} />
                </div>

                {/* Oficio */}
                <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Wrench size={14} color="var(--gray-400)" /> Oficio / especialidad *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {TRADES.map(t => (
                            <button key={t} type="button" onClick={() => set('trade', t)} style={{
                                padding: '9px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                border: form.trade === t ? '2px solid var(--brand-accent)' : '1.5px solid var(--gray-200)',
                                background: form.trade === t ? '#eff6ff' : 'white',
                                color: form.trade === t ? 'var(--brand-accent)' : 'var(--gray-700)',
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={14} color="var(--gray-400)" /> Número de WhatsApp
                    </label>
                    <input style={inputStyle} placeholder="+5491155..."
                        value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} />
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                        El cliente usa este número para contactarte. Formato: +549XXXXXXXXXX
                    </span>
                </div>

                {/* Logo URL */}
                <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ImagePlus size={14} color="var(--gray-400)" /> Logo (URL de imagen)
                    </label>
                    <input style={inputStyle} placeholder="https://... (opcional)"
                        value={form.logo_url} onChange={e => set('logo_url', e.target.value)} />
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                        Pegá la URL de tu logo. Aparecerá en el encabezado del presupuesto.
                    </span>
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
                    onClick={handleSave} disabled={saving || !form.name}>
                    {saving
                        ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Guardando...</>
                        : <><Save size={16} /> Guardar perfil</>
                    }
                </button>
            </div>
        </div>
    )
}
