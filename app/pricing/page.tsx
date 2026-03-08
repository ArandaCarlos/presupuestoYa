import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Check, Zap, Star, ArrowRight } from 'lucide-react'

const FREE_FEATURES = [
    'Hasta 5 presupuestos por mes',
    'Link compartible por WhatsApp',
    'Vista profesional para el cliente',
    'Botón Aceptar / Rechazar',
    'Mejora de texto con IA',
]

const PRO_FEATURES = [
    'Presupuestos ilimitados',
    'Estadísticas avanzadas',
    'Historial completo',
    'Recordatorios automáticos al cliente',
    'Perfil con logo incluido',
    'Soporte prioritario',
    'Próximamente: bot WhatsApp',
]

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let currentPlan = 'free'
    if (user) {
        const { data: prof } = await supabase
            .from('professionals')
            .select('plan')
            .eq('user_id', user.id)
            .maybeSingle()
        currentPlan = prof?.plan || 'free'
    }

    const isPro = currentPlan === 'pro'

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 60%, #f0fdf4 100%)',
            padding: '60px 24px'
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                            borderRadius: 12, padding: '8px 16px', marginBottom: 24
                        }}>
                            <Zap size={18} color="white" fill="white" />
                            <span style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>PresupuestoYA</span>
                        </div>
                    </Link>

                    <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 12, lineHeight: 1.2 }}>
                        Planes simples y transparentes
                    </h1>
                    <p style={{ fontSize: 17, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
                        Empezá gratis. Subí al Pro cuando necesites más.
                    </p>
                </div>

                {/* Cards */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 24, alignItems: 'start'
                }}>

                    {/* FREE */}
                    <div style={{
                        background: 'white', borderRadius: 24, padding: 32,
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                                Free
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                                <span style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>$0</span>
                                <span style={{ fontSize: 15, color: '#94a3b8', paddingBottom: 6 }}>/ mes</span>
                            </div>
                            <p style={{ fontSize: 14, color: '#64748b' }}>
                                Para empezar y probar la herramienta sin comprometerte.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                            {FREE_FEATURES.map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 10, background: '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1
                                    }}>
                                        <Check size={12} color="#64748b" strokeWidth={2.5} />
                                    </div>
                                    <span style={{ fontSize: 14, color: '#475569' }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {user ? (
                            <Link href="/dashboard" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px 24px', borderRadius: 12, textDecoration: 'none',
                                border: '2px solid #e2e8f0', fontSize: 15, fontWeight: 700,
                                color: '#64748b', background: 'white'
                            }}>
                                {isPro ? 'Tu plan actual gratuito' : '✓ Tu plan actual'}
                            </Link>
                        ) : (
                            <Link href="/login" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px 24px', borderRadius: 12, textDecoration: 'none',
                                border: '2px solid #e2e8f0', fontSize: 15, fontWeight: 700,
                                color: '#0f172a', background: 'white'
                            }}>
                                Empezar gratis <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>

                    {/* PRO */}
                    <div style={{
                        background: 'linear-gradient(145deg, #1e3a8a, #2563eb)',
                        borderRadius: 24, padding: 32,
                        boxShadow: '0 20px 60px rgba(37,99,235,0.30)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Glow */}
                        <div style={{
                            position: 'absolute', top: -60, right: -60,
                            width: 200, height: 200, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)'
                        }} />

                        <div style={{ marginBottom: 24, position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px' }}>Pro</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                                <span style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1 }}>$14.000</span>
                                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', paddingBottom: 6 }}>ARS / mes</span>
                            </div>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                                Para el profesional que quiere crecer y cerrar más trabajos.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, position: 'relative' }}>
                            {PRO_FEATURES.map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1
                                    }}>
                                        <Check size={12} color="white" strokeWidth={2.5} />
                                    </div>
                                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {user ? (
                            isPro ? (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    padding: '13px 24px', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.15)', fontSize: 15, fontWeight: 700, color: 'white'
                                }}>
                                    ✓ Tu plan actual — Pro
                                </div>
                            ) : (
                                <Link href="/dashboard/upgrade" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    padding: '13px 24px', borderRadius: 12, textDecoration: 'none',
                                    background: 'white', fontSize: 15, fontWeight: 700, color: '#1e3a8a'
                                }}>
                                    Pasarme al Pro <ArrowRight size={16} />
                                </Link>
                            )
                        ) : (
                            <Link href="/login" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px 24px', borderRadius: 12, textDecoration: 'none',
                                background: 'white', fontSize: 15, fontWeight: 700, color: '#1e3a8a'
                            }}>
                                Empezar con Pro <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* FAQ */}
                <div style={{ marginTop: 64, textAlign: 'center' }}>
                    <p style={{ fontSize: 14, color: '#94a3b8' }}>
                        ¿Tenés dudas? Escribinos por WhatsApp o mandanos un mail. Sin letra chica.
                    </p>
                    {user && (
                        <Link href="/dashboard" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            marginTop: 16, fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 600
                        }}>
                            ← Volver al panel
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
