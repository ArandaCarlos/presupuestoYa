import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText, CheckCircle, Clock, Send, TrendingUp } from 'lucide-react'
import type { Quote } from '@/lib/types'
import QuotesTable from '../components/QuotesTable'

function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: number | string; icon: any; color: string
}) {
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Icon size={22} color={color} />
            </div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 4 }}>{label}</div>
            </div>
        </div>
    )
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const paymentStatus = params.payment

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Buscar profesional por user_id (aislado)
    const { data: professional } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle()

    // Obtener presupuestos del profesional actual
    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('professional_id', professional?.id ?? '00000000-0000-0000-0000-000000000000')
        .order('created_at', { ascending: false })
        .limit(10)

    const all = quotes || []
    const sent = all.filter(q => ['sent', 'viewed'].includes(q.status)).length
    const accepted = all.filter(q => q.status === 'accepted').length
    const total = all.length

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>
                    Hola, {professional?.name?.split(' ')[0] || 'bienvenido'} 👋
                </h1>
                <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>
                    Aquí está el resumen de tu actividad
                </p>
            </div>

            {/* Alerta de pago exitoso MP */}
            {paymentStatus === 'success' && (
                <div style={{
                    background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12,
                    padding: '16px 20px', marginBottom: 32, display: 'flex', gap: 12, alignItems: 'flex-start'
                }}>
                    <CheckCircle size={24} color="#10b981" style={{ flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', marginBottom: 4 }}>
                            ¡Pago completado con éxito!
                        </h3>
                        <p style={{ fontSize: 14, color: '#047857' }}>
                            Ya tenés activo el Plan Pro por 30 días. Recordá recargar la página en unos segundos si tu estado aún no se actualiza (puede demorar un instante en procesarse).
                        </p>
                    </div>
                </div>
            )}
            {paymentStatus === 'failure' && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                    padding: '16px 20px', marginBottom: 32, display: 'flex', gap: 12, alignItems: 'flex-start'
                }}>
                    <div style={{ fontSize: 24 }}>⚠️</div>
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
                            El pago no se pudo completar
                        </h3>
                        <p style={{ fontSize: 14, color: '#b91c1c' }}>
                            Ocurrió un problema al procesar tu pago. Podés volver a intentarlo desde la sección "Pasarte al Pro".
                        </p>
                    </div>
                </div>
            )}

            {/* CTA si no hay presupuestos */}
            {total === 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-accent) 100%)',
                    borderRadius: 20, padding: '32px', marginBottom: 32, color: 'white', textAlign: 'center'
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                        Creá tu primer presupuesto
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 24, fontSize: 15 }}>
                        Generá un presupuesto profesional en menos de 60 segundos.
                    </p>
                    <Link href="/dashboard/quotes/new" className="btn"
                        style={{ background: 'white', color: 'var(--brand-blue)', fontWeight: 700, fontSize: 15, padding: '12px 28px', borderRadius: 12 }}>
                        <Plus size={18} /> Nuevo presupuesto
                    </Link>
                </div>
            )}

            {/* Stats */}
            {total > 0 && (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16, marginBottom: 32
                }}>
                    <StatCard label="Total enviados" value={total} icon={FileText} color="var(--brand-accent)" />
                    <StatCard label="Pendientes" value={sent} icon={Clock} color="#f59e0b" />
                    <StatCard label="Aceptados" value={accepted} icon={CheckCircle} color="var(--brand-green)" />
                    <StatCard label="Tasa de cierre" value={total > 0 ? `${Math.round((accepted / total) * 100)}%` : '—'} icon={TrendingUp} color="#8b5cf6" />
                </div>
            )}

            {/* Presupuestos recientes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>
                    Presupuestos recientes
                </h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link href="/dashboard/quotes" className="btn btn-secondary btn-sm">Ver todos</Link>
                    <Link href="/dashboard/quotes/new" className="btn btn-primary btn-sm"><Plus size={14} /> Nuevo</Link>
                </div>
            </div>

            {all.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gray-400)' }}>
                    <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <p>No hay presupuestos aún</p>
                </div>
            ) : (
                <QuotesTable quotes={all} />
            )}
        </div>
    )
}