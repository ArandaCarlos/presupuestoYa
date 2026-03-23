'use client'
 
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Zap, ChevronRight, Sparkles, ImagePlus } from 'lucide-react'
 
const TRADES = [
    'Electricista', 'Plomero', 'Gasista', 'Pintor', 'Carpintero',
    'Albañil', 'Limpieza profesional', 'Jardinero', 'Aire acondicionado',
    'Herrería', 'Mudanzas', 'Otro'
]
 
export default function OnboardingPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        trade: '',
        whatsapp_number: '',
        logo_url: '',
    })
 
    const supabase = createClient()
 
    const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))
 
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
 
        setUploading(true)
        setError('')
 
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')
 
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`
 
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file)
 
            if (uploadError) throw uploadError
 
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath)
 
            set('logo_url', publicUrl)
        } catch (err: any) {
            console.error('Upload error:', err)
            setError('Error subiendo la imagen. Intentá con un archivo más chico o formato JPG/PNG.')
        } finally {
            setUploading(false)
        }
    }
 
    const handleSave = async () => {
        if (!form.name || !form.trade) return
        setSaving(true)
        setError('')
 
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
 
        const { error: err } = await supabase.from('professionals').upsert({
            user_id: user.id,
            whatsapp_number: form.whatsapp_number || null,
            name: form.name,
            trade: form.trade,
            logo_url: form.logo_url || null,
        }, { onConflict: 'user_id' })
 
        if (err) {
            setError('No se pudo guardar. Intentá de nuevo.')
            setSaving(false)
            return
        }
 
        router.push('/dashboard')
    }
 
    const inputStyle = {
        width: '100%', padding: '12px 16px',
        border: '1.5px solid var(--gray-200)', borderRadius: 12,
        fontSize: 15, fontFamily: 'inherit', color: 'var(--gray-900)',
        background: 'white', outline: 'none'
    }
 
    const isValid = form.name.trim().length >= 2 && form.trade && form.whatsapp_number.trim().length >= 8
 
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '24px'
        }}>
            <div style={{ width: '100%', maxWidth: 500 }}>
 
                {/* Logo + welcome */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                        borderRadius: 14, padding: '10px 18px', marginBottom: 20
                    }}>
                        <Zap size={20} color="white" fill="white" />
                        <span style={{ color: 'white', fontWeight: 800, fontSize: 17 }}>PresupuestosYA</span>
                    </div>
 
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
                        ¡Bienvenido! 👋
                    </h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 15, maxWidth: 380, margin: '0 auto' }}>
                        Antes de empezar, completá tu perfil. Esto aparece en los presupuestos que enviás a tus clientes.
                    </p>
                </div>
 
                {/* Card */}
                <div className="card" style={{ padding: '28px', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
 
                    {/* Preview vivo */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--brand-blue), #1e40af)',
                        borderRadius: 14, padding: '14px 18px', marginBottom: 24,
                        display: 'flex', alignItems: 'center', gap: 12
                    }}>
                        {form.logo_url ? (
                            <img src={form.logo_url} alt="logo" style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', background: 'white' }} />
                        ) : (
                            <div style={{
                                width: 42, height: 42, borderRadius: 10,
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, fontWeight: 700, color: 'white'
                            }}>
                                {form.name ? form.name[0].toUpperCase() : '?'}
                            </div>
                        )}
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
                                {form.name || 'Tu nombre'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                                {form.trade || 'Tu oficio'}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                            preview →
                        </div>
                    </div>
 
                    {error && (
                        <div style={{
                            background: '#fee2e2', borderRadius: 10, padding: '10px 14px',
                            fontSize: 13, color: '#dc2626', marginBottom: 16
                        }}>{error}</div>
                    )}
 
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
 
                        {/* Nombre */}
                        <div className="input-group">
                            <label className="input-label">Tu nombre completo *</label>
                            <input style={inputStyle} placeholder="Ej: Juan García"
                                value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
                        </div>
 
                        {/* Oficio */}
                        <div className="input-group">
                            <label className="input-label">¿A qué te dedicás? *</label>
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
                            <label className="input-label">
                                WhatsApp *
                            </label>
                            <input style={inputStyle} placeholder="+5491155..."
                                value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} />
                            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                                Fundamental para compartir tus presupuestos. Formato recomendado: +549XXXXXXXXXX
                            </span>
                        </div>
 
                        {/* Logo / Foto */}
                        <div className="input-group">
                            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ImagePlus size={14} color="var(--gray-400)" /> Foto de perfil / Logo <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span>
                            </label>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {form.logo_url && (
                                    <div style={{ position: 'relative' }}>
                                        <img src={form.logo_url} alt="Preview" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--gray-200)' }} />
                                        <button 
                                            type="button"
                                            onClick={() => set('logo_url', '')}
                                            style={{
                                                position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white',
                                                width: 24, height: 24, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold'
                                            }}
                                        >×</button>
                                    </div>
                                )}
                                
                                <label style={{
                                    flex: 1, height: 80, border: '2px dashed var(--gray-200)', borderRadius: 12,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', background: 'var(--gray-50)', transition: 'all 0.2s',
                                    opacity: uploading ? 0.6 : 1
                                }} className="upload-label">
                                    {uploading ? (
                                        <div className="spinner" style={{ width: 20, height: 20 }} />
                                    ) : (
                                        <>
                                            <ImagePlus size={20} color="var(--gray-400)" />
                                            <span style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                                                {form.logo_url ? 'Cambiar imagen' : 'Subir imagen'}
                                            </span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} disabled={uploading} />
                                </label>
                            </div>
                        </div>
 
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 4 }}
                            onClick={handleSave}
                            disabled={saving || !isValid}
                        >
                            {saving
                                ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Guardando...</>
                                : <>Empezar a usar PresupuestosYA <ChevronRight size={18} /></>
                            }
                        </button>
 
                        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)' }}>
                            Podés modificar estos datos en cualquier momento desde Mi perfil
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
