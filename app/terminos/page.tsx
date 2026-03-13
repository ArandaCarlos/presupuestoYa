import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'white', color: '#0f172a', padding: '40px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gray-500)', textDecoration: 'none', marginBottom: 40, fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>
                
                <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 24, letterSpacing: '-1px' }}>Términos y Condiciones</h1>
                <p style={{ color: 'var(--gray-500)', marginBottom: 40 }}>Última actualización: {new Date().toLocaleDateString()}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 16, lineHeight: 1.6, color: 'var(--gray-700)' }}>
                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>1. Uso del Servicio</h2>
                        <p>Al acceder y utilizar PresupuestosYA, aceptás estar sujeto a estos Términos y Condiciones. Nuestro servicio te permite crear, enviar y gestionar presupuestos de forma digital. Acordás usar la plataforma únicamente para fines lícitos y comerciales legítimos.</p>
                    </section>
                    
                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>2. Cuentas y Suscripciones</h2>
                        <p>Para usar ciertas funciones, debés crear una cuenta. Sos responsable de mantener la confidencialidad de tu contraseña. Ofrecemos planes gratuitos y de pago. Las características y límites de cada plan están detallados en nuestra página de tarifas. Nos reservamos el derecho de modificar los precios con previo aviso.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>3. Contenido del Usuario</h2>
                        <p>Sos el único responsable de la precisión de los presupuestos y datos que ingresás. PresupuestosYA no revisa ni aprueba los precios, servicios ofrecidos ni la relación contractual entre vos y tus clientes.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>4. Inteligencia Artificial</h2>
                        <p>Al utilizar la función de "Mejorar descripción con IA", aceptás que tu texto sea procesado por servicios de terceros (como OpenAI o Google). Aunque la IA busca mejorar la redacción, siempre debés revisar el resultado final antes de enviar un presupuesto, ya que PresupuestosYA no se hace responsable por errores introducidos u omisiones.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>5. Limitación de Responsabilidad</h2>
                        <p>PresupuestosYA se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores. Bajo ninguna circunstancia seremos responsables de daños indirectos, pérdida de ingresos o disputas legales derivadas de los presupuestos emitidos a través de nuestra herramienta.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
