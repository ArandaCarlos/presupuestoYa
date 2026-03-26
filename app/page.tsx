'use client'

import Link from 'next/link'
import { Zap, CheckCircle2, ArrowRight, XCircle, Search, Smartphone, Star, ShieldCheck, Check, Sparkles, FileText, Send, CheckCircle } from 'lucide-react'

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
                            Dejá de mandar precios desordenados por WhatsApp. Generá un presupuesto prolijo, enviá un link a tu cliente y convertilo en factura en un clic. <strong>Nunca fue tan fácil.</strong>
                        </p>

                        <div>
                            <Link href="/login" className="btn-hover" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                                color: 'white', textDecoration: 'none', padding: '18px 36px', borderRadius: 16,
                                fontSize: 18, fontWeight: 800, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                                marginBottom: 16, transition: 'all 0.2s ease'
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

                                <div className="btn-hover" style={{
                                    width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: 'white', border: 'none',
                                    padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }}>
                                    Aceptar presupuesto <CheckCircle2 size={18} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>


            {/* Video Demo Section */}
            <section style={{ 
                padding: '80px 24px', 
                background: 'white', 
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#eff6ff', color: 'var(--brand-blue)',
                        padding: '8px 16px', borderRadius: 30, fontSize: 13, fontWeight: 700, marginBottom: 20
                    }}>
                        <Sparkles size={16} /> Mirá cómo funciona PresupuestosYA
                    </div>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', marginBottom: 40, letterSpacing: '-1px' }}>
                        De la idea a la firma en <span style={{ color: 'var(--brand-blue)' }}>menos de 2 minutos</span>
                    </h2>
                    
                    <div style={{ 
                        position: 'relative', 
                        borderRadius: 32, 
                        overflow: 'hidden', 
                        boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.05)',
                        background: '#000',
                        aspectRatio: '16/9',
                        border: '8px solid white'
                    }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/3UwMLo5TDFc?rel=0&modestbranding=1" 
                            title="PresupuestosYA Demo"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={{ display: 'block' }}
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section style={{ padding: '100px 24px', background: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
                        ¿Cómo funciona?
                    </h2>
                    <p style={{ fontSize: 18, color: '#64748b', marginBottom: 80 }}>
                        Cuatro pasos. Sin complicaciones.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 32 }}>
                        {[
                            {
                                icon: <FileText size={24} color="#4b5563" />,
                                title: 'Creás el presupuesto en 1 minuto',
                                desc: 'Completá los datos del trabajo, los materiales y el precio. Listo.'
                            },
                            {
                                icon: <Send size={24} color="#4b5563" />,
                                title: 'Enviás el link por WhatsApp',
                                desc: 'Tu cliente recibe un link profesional que puede abrir desde cualquier celular.'
                            },
                            {
                                icon: <CheckCircle size={24} color="#10b981" />,
                                title: 'El cliente lo acepta con un clic',
                                desc: 'Sin llamadas ni idas y vueltas. Recibís la confirmación al instante.'
                            },
                            {
                                icon: <Zap size={24} color="#f59e0b" />,
                                title: 'Factura en un clic (Opcional)',
                                desc: '¿Trabajo terminado? Convertí el presupuesto en factura con un solo botón.'
                            }
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    background: '#f3f4f6', padding: 12, borderRadius: 12, marginBottom: 24,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {step.icon}
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>{step.title}</h3>
                                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, maxWidth: 240 }}>{step.desc}</p>
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
                                { text: 'Todo tu historial organizado y seguro en la nube', icon: <ShieldCheck size={20} color="#3b82f6" /> },
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
                        <p style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>Tu oficina digital: todo guardado, seguro y accesible.</p>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> Transmitís profesionalismo a primera vista</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> Tenés el control total: encontrás todo en segundos</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 600 }}><Check size={20} color="var(--brand-accent)" /> No perdés más presupuestos en el caos de WhatsApp</div>
                        </div>
                        <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--gray-500)', borderLeft: '4px solid var(--gray-300)', paddingLeft: 16 }}>
                            "La organización es la mitad del trabajo. Acceder a tus datos rápido te hace más productivo."
                        </p>
                    </div>

                </div>
            </section>

            {/* Visual Quote Section */}
            <section style={{ padding: '100px 24px', background: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 60, lineHeight: 1.1 }}>
                        Así se ve el presupuesto <br /> que recibe tu cliente
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center', textAlign: 'left' }}>
                        {/* Mockup del Presupuesto */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                background: 'white', borderRadius: 24, overflow: 'hidden',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9'
                            }}>
                                {/* Top bar */}
                                <div style={{ background: '#16a34a', color: 'white', padding: '10px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle size={14} /> Presupuesto aceptado! El profesional fue notificado.
                                </div>
                                {/* Header */}
                                <div style={{ background: '#1e3a8a', padding: 24, color: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>J</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 16 }}>Juan Garcia</div>
                                            <div style={{ fontSize: 12, opacity: 0.7 }}>Electricista</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6 }}>
                                        <span>Presupuesto #D2QRYEG6</span>
                                        <span>Válido hasta: 23 de marzo de 2026</span>
                                    </div>
                                </div>
                                {/* Body */}
                                <div style={{ padding: 24 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 4 }}>Trabajo a realizar</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Instalación eléctrica</div>
                                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
                                        Reemplazo de llaves térmicas antiguas por disyuntores normalizados, asegurando la máxima seguridad...
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, marginBottom: 20 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Detalle del presupuesto</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                                            <span style={{ color: '#64748b' }}>Mano de obra</span>
                                            <span style={{ fontWeight: 600 }}>$200.000</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
                                            <span style={{ color: '#64748b' }}>Materiales</span>
                                            <span style={{ fontWeight: 600 }}>$90.000</span>
                                        </div>
                                        <div style={{ background: '#1e3a8a', color: 'white', padding: '12px 16px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, fontWeight: 600 }}>TOTAL</span>
                                            <span style={{ fontSize: 20, fontWeight: 800 }}>$290.000</span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                                        <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>¡Acuerdo Firmado!</div>
                                        <div style={{ fontSize: 11, color: '#15803d' }}>El profesional fue notificado. Vas a recibir confirmación de contacto a la brevedad.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Detail */}
                        <div>
                            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, marginBottom: 40 }}>
                                Tu cliente recibe un link que abre una página profesional con todos los detalles del trabajo y el precio. Sin archivos adjuntos, sin PDFs. Simple.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    'Aspecto profesional',
                                    'Precio claro y detallado',
                                    'Botón para aceptar al instante'
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ background: '#dcfce7', padding: 8, borderRadius: '50%', display: 'flex' }}>
                                            <Check size={20} color="#16a34a" strokeWidth={3} />
                                        </div>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Invoice Preview Section */}
            <section style={{ padding: '100px 24px', background: '#f0fdf4', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
                    <div style={{ order: 2 }}>
                        <div style={{
                            background: 'white', borderRadius: 24, padding: 40,
                            boxShadow: '0 30px 60px rgba(22, 163, 74, 0.12)',
                            border: '1px solid #dcfce7', transform: 'rotate(-1deg)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--brand-blue)' }}>FACTURA</div>
                                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>FAC-1001</div>
                            </div>

                            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 24, marginBottom: 24 }}>
                                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Cliente</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Juan Garcia</div>
                                <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>juan.garcia@email.com</div>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <span style={{ fontWeight: 600 }}>Total a pagar</span>
                                    <span style={{ fontWeight: 900, fontSize: 24, color: 'var(--brand-blue)' }}>$290.000</span>
                                </div>
                            </div>

                            <Link href="https://presupuestosya.app/p/factura/46c3c339-5f98-49c9-82e0-77eaf6987050" target="_blank" className="btn-hover" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                                background: 'var(--brand-blue)', color: 'white', padding: '18px', borderRadius: 16,
                                textDecoration: 'none', fontWeight: 800, fontSize: 16
                            }}>
                                Ver y Descargar Factura Real <FileText size={20} />
                            </Link>
                        </div>
                    </div>
                    <div style={{ order: 1 }}>
                        <div style={{ display: 'inline-flex', background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                            NUEVA FUNCIÓN
                        </div>
                        <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', marginBottom: 24, lineHeight: 1.1 }}>
                            Convertí tus presupuestos en facturas <span style={{ color: '#16a34a' }}>al instante</span>
                        </h2>
                        <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, marginBottom: 32 }}>
                            ¿Terminaste el trabajo? Generá una factura inmutable con un solo clic. Profesional, detallada y lista para descargar en PDF o compartir por WhatsApp.
                            <strong> Gestionarlos nunca fue tan fácil.</strong>
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                'Cero carga de datos: se completa sola',
                                'Numeración correlativa automática',
                                'Descarga en PDF ultra profesional',
                                'Mismo link para compartir rápido'
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ background: '#16a34a', borderRadius: '50%', padding: 4 }}>
                                        <Check size={14} color="white" strokeWidth={4} />
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* Final CTA */}
            <section style={{ padding: '120px 24px', background: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', boxSizing: 'border-box' }}>
                    <h2 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', marginBottom: 16, letterSpacing: '-1.5px' }}>
                        Empezá a enviar presupuestos profesionales hoy
                    </h2>
                    <p style={{ fontSize: 18, color: '#64748b', marginBottom: 40 }}>
                        Creá tu cuenta en segundos. Sin tarjeta, sin compromiso.
                    </p>

                    <Link href="/login" className="btn-hover" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                        color: 'white', textDecoration: 'none',
                        padding: '16px 40px', borderRadius: 12,
                        fontSize: 18, fontWeight: 800,
                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
                        transition: 'all 0.2s ease'
                    }}>
                        Crear cuenta gratis
                    </Link>
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
                            <a href="mailto:soporte.presupuestoya@gmail.com" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500 }}>Soporte</a>
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

                .btn-hover:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
                }
                
                @media (max-width: 900px) {
                    .hero-grid { 
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