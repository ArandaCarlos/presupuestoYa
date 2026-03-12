import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Check, Zap, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

const PRO_FEATURES = [
    'Presupuestos ilimitados',
    'Estadísticas avanzadas',
    'Historial completo',
    'Recordatorios automáticos',
    'Soporte prioritario',
    'Próximamente: bot WhatsApp',
]

export default function UpgradePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [mpReady, setMpReady] = useState(false)

    useEffect(() => {
        // Cargar script de MercadoPago
        const script = document.createElement('script')
        script.src = 'https://sdk.mercadopago.com/js/v2'
        script.onload = () => setMpReady(true)
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handleUpgrade = async () => {
        if (!mpReady) {
            setError('MercadoPago aún se está cargando, intentá de nuevo en unos segundos.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/subscription/create', { method: 'POST' })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Error al crear la suscripción')
            if (!data.preference_id) throw new Error('No se recibió la ID de preferencia')

            // Inicializar MercadoPago Checkout Pro
            // @ts-ignore
            const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
                locale: 'es-AR'
            })

            // Abrir el modal de pago
            mp.checkout({
                preference: {
                    id: data.preference_id
                },
                autoOpen: true, // Se abre automáticamente
            })
            setLoading(false) // Dejar de mostrar loading porque el modal ya está abierto

        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="fade-in" style={{ maxWidth: 520 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 12, paddingLeft: 0 }}>
                    ← Volver al panel
                </Link>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)' }}>
                    Pasarte al Pro
                </h1>
                <p style={{ color: 'var(--gray-500)', fontSize: 15, marginTop: 4 }}>
                    Desbloqueá todo para hacer crecer tu negocio.
                </p>
            </div>

            {/* Card Pro */}
            <div style={{
                background: 'linear-gradient(145deg, #1e3a8a, #2563eb)',
                borderRadius: 24, padding: '32px',
                boxShadow: '0 20px 60px rgba(37,99,235,0.25)',
                marginBottom: 20, position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: -50, right: -50, width: 180, height: 180,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Plan Pro
                    </span>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                        <span style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>$14.000</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, paddingBottom: 6 }}>ARS / mes</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                        Menos de $470/día para un negocio más profesional.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {PRO_FEATURES.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Check size={11} color="white" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#fca5a5'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '14px 24px', borderRadius: 14,
                        background: 'white', border: 'none', cursor: 'pointer',
                        fontSize: 16, fontWeight: 800, color: '#1e3a8a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading
                        ? <><div className="spinner" style={{ borderTopColor: '#1e3a8a', borderWidth: 2 }} /> Cargando checkout...</>
                        : <>Suscribirme ahora <ArrowRight size={18} /></>
                    }
                </button>
            </div>

            {/* Trust signals */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: '#f0fdf4', borderRadius: 12, padding: '14px 16px',
                border: '1px solid #bbf7d0'
            }}>
                <Shield size={18} color="#15803d" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: '#15803d' }}>
                    <strong>Pago 100% seguro vía MercadoPago.</strong> Podés cancelar tu suscripción en cualquier momento desde tu cuenta de MercadoPago, sin trámites ni llamadas.
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link href="/pricing" style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'none' }}>
                    Ver comparativa completa de planes →
                </Link>
            </div>
            
            <div id="wallet_container" />
        </div>
    )
}
