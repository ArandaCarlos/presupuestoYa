import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PresupuestoYA — Presupuestos profesionales en 60 segundos',
  description: 'Generá presupuestos profesionales para oficios desde WhatsApp. Rápido, simple y profesional.',
  keywords: 'presupuesto, electricista, plomero, gasista, pintor, oficio, cotización',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
