'use client'

import Link from 'next/link'
import { Zap, CheckCircle2, ArrowRight, XCircle, Search, Smartphone, Star, ShieldCheck, Check, Sparkles } from 'lucide-react'

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{
                padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box'
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
                    <Link href="/pricing" className="hide-mobile" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-500)', textDecoration: 'none' }}>Tarifas</Link>
                    <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: 'var(--brand-blue)', textDecoration: 'none' }}>Iniciar Sesión</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                padding: '80px 24px', background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: 60, alignItems: 'center', boxSizing: 'border-box'
                }} className="hero-grid">

                    {/* Hero Left (Text) */}
                    <div>
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
                            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900,
                            color: '#0f172a', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24
                        }}>
                            Creá presupuestos profesionales en <span style={{ color: 'var(--brand-blue)' }}>60 segundos</span>
                        </h1>

                        <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
                            Dejá de mandar precios desordenados por WhatsApp. Generá un presupuesto prolijo, enviá un link a tu cliente y dejá que lo acepte con un clic.
                        </p>

                        <div>
                            <Link href="/login" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                                color: 'white', textDecoration: 'none', padding: '18px 36px', borderRadius: 16,
                                fontSize: 18, fontWeight: 800, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                                marginBottom: 16
                            }}>
                                Crear mi primer presupuesto gratis <ArrowRight size={20} />
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: 13, fontWeight: 500 }}>
                                <ShieldCheck size={14} /> Sin tarjeta • Listo en segundos
                            </div>
                        </div>
                    </div>
                    {/* Hero Right (Visual) - Demo Interactiva */}
                    <div style={{ display: 'flex', justifyContent: 'center' }} className="hero-visual">
                        <Link href="/p/d2qryeg6" target="_blank" style={{ textDecoration: 'none', width: '100%', maxWidth: 420 }}>
                            <div style={{
                                background: 'white', borderRadius: 24, padding: 32, width: '100%',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '1px solid var(--gray-100)',
                                transform: 'rotate(2deg)', transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'pointer', boxSizing: 'border-box'
                            }} className="ticket-card"
                                onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(2deg)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.1)' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #e2e8f0', paddingBottom: 20, marginBottom: 20 }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                                            Electricista Autorizado
                                        </div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>
                                            Juan Garcia
                                        </div>
                                    </div>
                                    <div style={{ background: '#eff6ff', color: 'var(--brand-blue)', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                                        Ver Demo Real
                                    </div>
                                </div>

                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
                                    Renovación Tablero Principal
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 20 }}>
                                    Reemplazo de llaves térmicas antiguas por disyuntores normalizados, sectorización de circuito de cocina y revisión de fuga a tierra.
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Mano de obra:</span>
                                    <span style={{ fontWeight: 600 }}>$200.000</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 14 }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Materiales incl:</span>
                                    <span style={{ fontWeight: 600 }}>$90.000</span>
                                </div>

                                <div style={{
                                    background: '#f8fafc', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: 24
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-500)' }}>TOTAL</span>
                                    <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-blue)' }}>$290.000</span>
                                </div>

                                <div style={{
                                    width: '100%', background: '#16a34a', color: 'white', border: 'none',
                                    padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}>
                                    Aceptar presupuesto <CheckCircle2 size={18} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* The Problem Section */}
            <section style={{ padding: '80px 24px', background: 'white' }}>
                <div style={{
                    maxWidth: 600, margin: '0 auto', boxSizing: 'border-box'
                }} className="problem-grid">

                    {/* Problem Left */}
                    <div>
                        <div style={{ display: 'inline-flex', background: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                            Problema
                        </div>
                        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 32, lineHeight: 1.1 }}>
                            ¿Te pasa esto cuando mandás presupuestos?
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                            {[
                                'Mandás precios por WhatsApp desordenados',
                                'Tardás demasiado en responder',
                                'Perdés trabajos porque otro respondió antes',
                                'Tus presupuestos no se ven profesionales',
                                'Después no sabés cuáles aceptaron'
                            ].map((prob, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    background: '#f8fafc', padding: '16px 20px', borderRadius: 16,
                                    fontSize: 16, color: 'var(--gray-700)', fontWeight: 500,
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ background: '#fee2e2', borderRadius: '50%', padding: 4, display: 'flex', flexShrink: 0 }}>
                                        <XCircle size={20} color="#ef4444" />
                                    </div>
                                    <span>{prob}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#fff1f2', color: '#be123c', padding: '20px 24px', borderRadius: 16, fontSize: 16, fontWeight: 700, borderLeft: '4px solid #ef4444' }}>
                            Muchas veces el trabajo lo gana el primero que envía un presupuesto claro.
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution Section */}
            <section style={{ padding: '80px 24px', background: '#0f172a', color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, color: 'white' }}>
                        Con PresupuestosYA lo resolvés en segundos
                    </h2>
                    <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 60 }}>
                        Simple, rápido y profesional.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                        {[
                            { num: '1️⃣', text: 'Creás el presupuesto en menos de 1 minuto' },
                            { num: '2️⃣', text: 'Se genera un link profesional automáticamente' },
                            { num: '3️⃣', text: 'Se lo enviás al cliente por WhatsApp' },
                            { num: '4️⃣', text: 'El cliente puede aceptarlo y firmarlo online' }
                        ].map((step, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: 40, marginBottom: 16 }}>{step.num}</div>
                                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{step.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits & Emotional Benefit */}
            <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: 60, boxSizing: 'border-box' }}>

                    {/* Benefits */}
                    <div style={{ background: 'white', padding: 48, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 24 }}>
                            Todo lo que necesitás para presupuestar mejor
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                            {[
                                { text: 'Presupuestos claros y profesionales', icon: <CheckCircle2 size={20} color="#16a34a" /> },
                                { text: 'Firma electrónica de tu cliente como comprobante', icon: <ShieldCheck size={20} color="#3b82f6" /> },
                                { text: 'Mejorá tu redacción con Inteligencia Artificial', icon: <Sparkles size={20} color="#a855f7" /> },
                                { text: 'Envío por link listo para WhatsApp', icon: <CheckCircle2 size={20} color="#16a34a" /> },
                                { text: 'Saber cuáles aceptaron o rechazaron', icon: <CheckCircle2 size={20} color="#16a34a" /> },
                                { text: 'Imagen profesional frente al cliente', icon: <CheckCircle2 size={20} color="#16a34a" /> }
                            ].map((ben, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: 'var(--gray-700)', fontWeight: 500 }}>
                                    <div style={{ flexShrink: 0 }}>{ben.icon}</div>
                                    {ben.text === 'Mejorá tu redacción con Inteligencia Artificial' ?
                                        <span>Mejorá tu redacción con <strong style={{ color: '#a855f7' }}>Inteligencia Artificial</strong></span>
                                        : ben.text === 'Firma electrónica de tu cliente como comprobante' ?
                                            <span><strong style={{ color: '#1e40af' }}>Acuerdos Firmados:</strong> evidencia sólida y confianza total</span>
                                            : ben.text}
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>Todo desde tu celular o computadora.</p>
                    </div>

                    {/* Emotional */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-flex', background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16, width: 'fit-content' }}>
                            EL SECRETO DEL ÉXITO
                        </div>
                        <h3 style={{ fontSize: 40, fontWeight: 900, color: 'var(--gray-900)', marginBottom: 24, lineHeight: 1.1 }}>
                            Cerrá más trabajos
                        </h3>
                        <p style={{ fontSize: 18, color: 'var(--gray-600)', marginBottom: 24 }}>
                            Cuando respondés rápido y con un presupuesto claro:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> transmitís profesionalismo</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> generás confianza</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> aumentás las chances de cerrar el trabajo</div>
                        </div>
                        <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--gray-500)', borderLeft: '4px solid var(--gray-300)', paddingLeft: 16 }}>
                            A veces el primero que responde es el que gana el cliente.
                        </p>
                    </div>

                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '100px 24px', background: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, color: '#0f172a', marginBottom: 16, letterSpacing: '-1px' }}>
                        Probalo gratis
                    </h2>
                    <p style={{ fontSize: 20, color: 'var(--gray-500)', marginBottom: 40 }}>
                        Creá tu primer presupuesto ahora y empezá a trabajar de forma más profesional.
                    </p>

                    <Link href="/login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                        color: 'white', textDecoration: 'none',
                        padding: '20px 48px', borderRadius: 100,
                        fontSize: 20, fontWeight: 800,
                        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                        marginBottom: 40
                    }}>
                        Crear mi primer presupuesto gratis
                    </Link>

                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                            Ideal para:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                            {['Electricistas', 'Plomeros', 'Pintores', 'Carpinteros', 'Técnicos', 'Freelancers', 'Mecánicos'].map((trade, i) => (
                                <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                                    {trade}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#0f172a', padding: '60px 24px 24px', color: 'rgba(255,255,255,0.6)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 40, marginBottom: 24, flexWrap: 'wrap', gap: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={24} color="#60a5fa" fill="#60a5fa" />
                            <span style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>PresupuestosYA</span>
                        </div>
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <Link href="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500 }}>Iniciar Sesión</Link>
                            <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500 }}>Tarifas</Link>
                            <a href="mailto:soporte@presupuestosya.app" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500 }}>Soporte</a>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 14 }}>
                        <div>© {new Date().getFullYear()} PresupuestosYA. Todos los derechos reservados.</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Link href="/terminos" style={{ color: 'inherit', textDecoration: 'none' }}>Términos y Condiciones</Link>
                            <Link href="/privacidad" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidad</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* CSS Additions for responsiveness */}
            <style dangerouslySetInnerHTML={{
                __html: `
                * {
                    box-sizing: border-box;
                }
                
                @media (max-width: 900px) {
                    .hero-grid, .problem-grid { 
                        grid-template-columns: 1fr !important; 
                        text-align: center; 
                    }
                    .hero-grid > div:first-child { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                    }
                    .hero-grid h1 { 
                        font-size: clamp(28px, 8vw, 36px) !important; 
                    }
                    .problem-grid h2 { 
                        font-size: clamp(24px, 6vw, 36px) !important; 
                    }
                    .hero-grid p { 
                        margin: 0 auto 32px !important; 
                    }
                    .hero-visual { 
                        justify-content: center !important; 
                    }
                    .ticket-card { 
                        transform: none !important; 
                        max-width: 100% !important;
                    }
                    .problem-grid > div:first-child { 
                        padding: 0; 
                        margin: 0 auto; 
                        max-width: 100%; 
                    }
                }
                @media (max-width: 640px) {
                    nav {
                        padding: 16px !important;
                    }
                    header, section, footer {
                        padding-left: 16px !important;
                        padding-right: 16px !important;
                    }
                    .hide-mobile {
                        display: none !important;
                    }
                }
            `}} />
        </div>
    )
}