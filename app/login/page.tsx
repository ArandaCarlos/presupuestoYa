'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const supabase = createClient()

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError('Email o contraseña incorrectos.')
                setLoading(false)
                return
            }
            router.push('/dashboard')
        } else if (mode === 'register') {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, nombre })
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al registrarse')
                setLoading(false)
                return
            }

            // Disparar Píxel de Meta con deduplicación (eventId)
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'CompleteRegistration', {}, { eventId: data.eventId });
            }

            setSuccess('¡Listo! Revisá tu email para confirmar la cuenta.')
        } else if (mode === 'forgot') {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`
            })
            if (error) {
                setError(error.message)
            } else {
                setSuccess('Se envió un correo con las instrucciones para restablecer tu contraseña.')
            }
        }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
        }}>
            {/* Background dots */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.15 }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: 300 + i * 100, height: 300 + i * 100,
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.5)',
                        top: `${10 + i * 15}%`, left: `${-5 + i * 10}%`,
                    }} />
                ))}
            </div>

            <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 16, padding: '10px 20px', marginBottom: 16
                    }}>
                        <Zap size={20} color="#60a5fa" fill="#60a5fa" />
                        <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>PresupuestosYA</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                        {mode === 'login' && 'Bienvenido de vuelta'}
                        {mode === 'register' && 'Crear cuenta gratis'}
                        {mode === 'forgot' && 'Recuperar contraseña'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                        {mode === 'login' && 'Ingresá para ver tus presupuestos'}
                        {mode === 'register' && 'Empezá a generar presupuestos hoy'}
                        {mode === 'forgot' && 'Ingresá tu correo asociado'}
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    padding: '32px 28px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                }}>
                    {/* Tabs */}
                    {mode !== 'forgot' && (
                        <div style={{
                            display: 'flex', background: 'var(--gray-100)',
                            borderRadius: 10, padding: 4, marginBottom: 24
                        }}>
                            {(['login', 'register'] as const).map(m => (
                                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                                    style={{
                                        flex: 1, padding: '8px', border: 'none', cursor: 'pointer',
                                        borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                                        background: mode === m ? 'white' : 'transparent',
                                        color: mode === m ? 'var(--brand-blue)' : 'var(--gray-500)',
                                        boxShadow: mode === m ? 'var(--shadow-sm)' : 'none'
                                    }}>
                                    {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                                </button>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid #fecaca',
                            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                            fontSize: 13, color: '#dc2626'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            background: '#dcfce7', border: '1px solid #bbf7d0',
                            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                            fontSize: 13, color: '#15803d'
                        }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {mode === 'register' && (
                            <div className="input-group">
                                <label className="input-label">Nombre completo</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
                                        placeholder="Ej: Juan Pérez"
                                        className="input"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} color="var(--gray-400)"
                                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="input" style={{ paddingLeft: 38 }}
                                />
                            </div>
                        </div>

                        {mode !== 'forgot' && (
                            <div className="input-group">
                                <label className="input-label">Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} color="var(--gray-400)"
                                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type={showPass ? 'text' : 'password'} required value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••" minLength={6}
                                        className="input" style={{ paddingLeft: 38, paddingRight: 38 }}
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)'
                                    }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: 4 }} disabled={loading}>
                            {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Procesando...</> :
                                mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Enviar instrucciones'}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 8 }}>
                                ¿No tenés cuenta?{' '}
                                <button type="button" onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-accent)', fontWeight: 600 }}>
                                    Registrate gratis
                                </button>
                            </p>
                            <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                                style={{ fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontWeight: 500, textDecoration: 'underline' }}>
                                Olvidé mi contraseña
                            </button>
                        </div>
                    )}

                    {mode === 'forgot' && (
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                                style={{ fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-accent)', fontWeight: 600 }}>
                                Volver a Iniciar sesión
                            </button>
                        </div>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    Plan Free: 5 presupuestos/mes sin tarjeta
                </p>
            </div>
        </div>
    )
}
