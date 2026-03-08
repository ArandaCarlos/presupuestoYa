import Link from 'next/link'

export default function QuoteNotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--gray-50)',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
                Presupuesto no encontrado
            </h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: 24, maxWidth: 360 }}>
                El link de este presupuesto no existe o venció. Pedile al profesional que te reenvíe el link actualizado.
            </p>
            <div style={{
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
                fontSize: 14,
                color: 'var(--gray-500)'
            }}>
                ¿Sos un profesional?{' '}
                <Link href="/login" style={{ color: 'var(--brand-accent)', fontWeight: 600, textDecoration: 'none' }}>
                    Iniciá sesión
                </Link>
            </div>
        </div>
    )
}
