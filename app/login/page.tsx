'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'

function LoginContent() {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingGoogle, setLoadingGoogle] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const m = searchParams.get('mode')
        if (m === 'register') setMode('register')
        if (m === 'login') setMode('login')
    }, [searchParams])

    const handleGoogleSignIn = async () => {
        setLoadingGoogle(true)
        setError('')
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            setError('No se pudo conectar con Google. Intentá de nuevo.')
            setLoadingGoogle(false)
        }
        // Si no hay error el browser redirige automáticamente a Google
    }

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

                    {/* Botón Google */}
                    {mode !== 'forgot' && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loadingGoogle || loading}
                                style={{
                                    width: '100%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    padding: '11px 16px',
                                    background: 'white',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: 10,
                                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                    color: '#374151',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                                    transition: 'all 0.15s',
                                    marginBottom: 16,
                                    opacity: loadingGoogle ? 0.7 : 1,
                                }}
                            >
                                {loadingGoogle ? (
                                    <span style={{ color: '#6b7280' }}>Conectando...</span>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24.48v8.88h12.984c-.56 3.018-2.252 5.574-4.8 7.288v6.056h7.764c4.544-4.186 7.104-10.35 7.104-17.526z" fill="#4285F4"/>
                                            <path d="M24.48 48c6.52 0 11.99-2.162 15.986-5.858l-7.764-6.056c-2.156 1.446-4.912 2.302-8.222 2.302-6.322 0-11.678-4.27-13.594-10.01H2.87v6.248C6.848 42.61 15.07 48 24.48 48z" fill="#34A853"/>
                                            <path d="M10.886 28.378A14.44 14.44 0 0 1 9.948 24c0-1.52.26-2.992.938-4.378v-6.248H2.87A23.976 23.976 0 0 0 .48 24c0 3.868.928 7.528 2.39 10.626l8.016-6.248z" fill="#FBBC05"/>
                                            <path d="M24.48 9.612c3.562 0 6.756 1.224 9.276 3.632l6.948-6.948C36.466 2.424 30.998 0 24.48 0 15.07 0 6.848 5.39 2.87 13.374l8.016 6.248c1.916-5.74 7.272-10.01 13.594-10.01z" fill="#EA4335"/>
                                        </svg>
                                        Continuar con Google
                                    </>
                                )}
                            </button>

                            {/* Separador */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap' }}>O continuá con email</span>
                                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                            </div>
                        </>
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
            <LoginContent />
        </Suspense>
    )
}
