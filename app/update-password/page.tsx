'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Verificar si existe una sesion activa (el token magic link loguea al usuario)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // Posiblemente el token es incorrecto o expiró
                setError('El enlace de recuperación es inválido o ha expirado. Por favor solicitá uno nuevo.')
            }
        }
        checkSession()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess('Contraseña actualizada correctamente.')
            setLoading(false)
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 20,
                    padding: '32px 28px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8, textAlign: 'center' }}>
                        Actualizar contraseña
                    </h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
                        Por favor, ingresá tu nueva contraseña.
                    </p>

                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid #fecaca',
                            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                            fontSize: 13, color: '#dc2626'
                        }}>
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                            <h2 style={{ fontSize: 18, color: '#16a34a', fontWeight: 700, marginBottom: 8 }}>
                                ¡Contraseña guardada!
                            </h2>
                            <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                                Te estamos redirigiendo al panel de control...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="input-group">
                                <label className="input-label">Nueva contraseña</label>
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

                            <button type="submit" className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: 4 }} disabled={loading}>
                                {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }} /> Guardando...</> : 'Guardar nueva contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
