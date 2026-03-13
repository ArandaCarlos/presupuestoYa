'use client'

import Link from 'next/link'
import { Zap, CheckCircle2, ArrowRight, Smartphone, Star, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ 
                padding: '20px 24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                maxWidth: 1200, margin: '0 auto', width: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                        borderRadius: 12, padding: 8, display: 'flex'
                    }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--brand-blue)' }}>PresupuestosYA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/pricing" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-500)', textDecoration: 'none' }}>
                        Tarifas
                    </Link>
                    <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: 'var(--brand-blue)', textDecoration: 'none' }}>
                        Iniciar Sesión
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                textAlign: 'center', padding: '100px 24px',
                background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Glow effect */}
                <div style={{
                    position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
                    width: '100%', maxWidth: 800, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'white', padding: '8px 16px', borderRadius: 30,
                    border: '1px solid var(--gray-200)', marginBottom: 24,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-600)' }}>Cerrá más trabajos con propuestas impecables</span>
                </div>
                
                <h1 style={{ 
                    fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, 
                    color: '#0f172a', lineHeight: 1.1, maxWidth: 800,
                    letterSpacing: '-1.5px', marginBottom: 24,
                    position: 'relative'
                }}>
                    Tu trabajo impresiona. <br/>
                    <span style={{ color: 'var(--brand-blue)' }}>Tus presupuestos también deberían.</span>
                </h1>

                <p style={{
                    fontSize: 'clamp(16px, 2vw, 20px)', color: '#64748b',
                    maxWidth: 600, lineHeight: 1.6, marginBottom: 40,
                    position: 'relative'
                }}>
                    Creá, enviá por WhatsApp y gestioná las cotizaciones de tu oficio en menos de 60 segundos. Más control para vos, mejor experiencia para tu cliente.
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
                    <Link href="/login" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                        color: 'white', textDecoration: 'none',
                        padding: '16px 32px', borderRadius: 16,
                        fontSize: 16, fontWeight: 800,
                        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                        transition: 'transform 0.2s'
                    }}>
                        Probá gratis ahora <ArrowRight size={18} />
                    </Link>
                    <Link href="/pricing" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'white', color: 'var(--gray-700)', textDecoration: 'none',
                        padding: '16px 32px', borderRadius: 16,
                        fontSize: 16, fontWeight: 700,
                        border: '2px solid var(--gray-200)',
                        transition: 'border-color 0.2s'
                    }}>
                        Ver planes
                    </Link>
                </div>
            </header>

            {/* Features Level */}
            <section style={{ padding: '100px 24px', background: 'white' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16, letterSpacing: '-0.5px' }}>
                            Todo lo que necesitás para potenciar tu oficio
                        </h2>
                        <p style={{ fontSize: 16, color: 'var(--gray-500)', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
                            Olvidate de pasar precios en un mensaje de texto perdido. Dale a tus servicios la imagen que merecen sin perder tiempo.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 32
                    }}>
                        {/* 1 */}
                        <div style={{
                            background: '#f8fafc', padding: 36, borderRadius: 24,
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, background: '#eff6ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--brand-blue)', marginBottom: 24
                            }}>
                                <Zap size={28} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
                                Envíos al instante
                            </h3>
                            <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                                Completás los datos básicos del trabajo, y el sistema arma un link profesional que refleja toda tu excelencia de forma automática.
                            </p>
                        </div>

                        {/* 2 */}
                        <div style={{
                            background: '#f8fafc', padding: 36, borderRadius: 24,
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, background: '#f0fdf4',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#16a34a', marginBottom: 24
                            }}>
                                <Smartphone size={28} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
                                Perfecto para WhatsApp
                            </h3>
                            <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                                Compartís una mini web interactiva con tu cliente. Lo lee fácil, se ve bien en cualquier celular y no hay que descargar nada.
                            </p>
                        </div>

                        {/* 3 */}
                        <div style={{
                            background: '#f8fafc', padding: 36, borderRadius: 24,
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, background: '#fdf4ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#c026d3', marginBottom: 24
                            }}>
                                <CheckCircle2 size={28} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
                                Confirmación asíncrona
                            </h3>
                            <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                                Tu cliente evalúa el costo y aprueba la cotización con solo apretar 'Aceptar', quedando todo registrado en tu base.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', padding: '100px 24px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <ShieldCheck size={48} color="#93c5fd" style={{ margin: '0 auto', marginBottom: 24 }} />
                    <h2 style={{ fontSize: 40, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-1px' }}>
                        Dejá de perder tiempo. <br />Multiplicá tus cierres.
                    </h2>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.5 }}>
                        Llevá el control de tus trabajos independientes al próximo nivel con una herramienta diseñada a la medida.
                    </p>
                    <Link href="/login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'white', color: '#0f172a', textDecoration: 'none',
                        padding: '18px 40px', borderRadius: 16,
                        fontSize: 18, fontWeight: 800,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    }}>
                        Comenzar gratis
                    </Link>
                </div>
            </section>

            {/* Footer Bottom */}
            <footer style={{ background: 'white', padding: '40px 24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{
                        background: 'var(--gray-200)',
                        borderRadius: 8, padding: 6, display: 'flex'
                    }}>
                        <Zap size={14} color="var(--gray-500)" fill="var(--gray-500)" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--gray-500)' }}>PresupuestosYA</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>
                    © {new Date().getFullYear()} PresupuestosYA. Simplificando el trabajo independiente.
                </div>
            </footer>
        </div>
    )
}
