import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'white', color: '#0f172a', padding: '40px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gray-500)', textDecoration: 'none', marginBottom: 40, fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>
                
                <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 24, letterSpacing: '-1px' }}>Privacidad</h1>
                <p style={{ color: 'var(--gray-500)', marginBottom: 40 }}>Última actualización: {new Date().toLocaleDateString()}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 16, lineHeight: 1.6, color: 'var(--gray-700)' }}>
                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>1. Datos Relevados</h2>
                        <p>PresupuestosYA recopila información necesaria para el funcionamiento de la plataforma: tu correo electrónico, número de WhatsApp, nombre/razón social e historial de presupuestos gestionados. Al subir información sobre o en nombre de tus clientes finales, confirmás que poseés el consentimiento para tratar esos datos.</p>
                    </section>
                    
                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>2. Uso de la Información</h2>
                        <p>Los datos que guardamos se utilizan exclusivamente para: (a) Renderizar correctamente los presupuestos y enviarlos por WhatsApp; (b) Ofrecerte estadísticas de tus aceptaciones o rechazos; (c) Proporcionar soporte técnico; (d) Asegurar el funcionamiento del servicio y prevenir abusos.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>3. Transferencia a Terceros e IA</h2>
                        <p>PresupuestosYA NO vende, alquila ni cede tu información transaccional a terceros de marketing. Sin embargo, para la funcionalidad explícita de "Mejorar descripción con IA", ese texto puntual será enviado a los servicios de OpenAI / Google Gemini para procesar la mejora. Esos proveedores actúan bajo sus propias políticas empresariales, pero no se usan datos sensibles atados a tu identidad para ese fin particular.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>4. Base de Datos</h2>
                        <p>Nuestra infraestructura primaria corre en Supabase sobre servicios estandarizados internacionalmente. Al usar la aplicación, otorgás tu consentimiento de esta delegación tecnológica en proveedores en la nube externos.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>5. Contacto DPO</h2>
                        <p>Si deseas borrar tu cuenta íntegramente de nuestros registros, acceder a tus datos, revocarlos o rectificarlos, contactate a <strong>soporte.presupuestoya@gmail.com</strong> y te ayudaremos con total celeridad técnica.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
