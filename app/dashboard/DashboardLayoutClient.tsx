'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
    LayoutDashboard, FileText, Plus, Settings, LogOut,
    Zap, Menu, X, ChevronRight, Star
} from 'lucide-react'

const NAV = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/quotes', label: 'Presupuestos', icon: FileText },
    { href: '/dashboard/quotes/new', label: 'Nuevo presupuesto', icon: Plus, highlight: true },
    { href: '/dashboard/settings', label: 'Mi perfil', icon: Settings },
]

export default function DashboardLayoutClient({
    children, user, plan
}: {
    children: React.ReactNode
    user: User
    plan?: string
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>

            {/* Sidebar (desktop) */}
            <aside style={{
                width: 240, background: 'white', borderRight: '1px solid var(--gray-200)',
                display: 'flex', flexDirection: 'column', padding: '20px 0',
                position: 'sticky', top: 0, height: '100vh', flexShrink: 0
            }}
                className="hidden-mobile">
                {/* Logo */}
                <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--gray-100)' }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                            borderRadius: 10, padding: 8, display: 'flex'
                        }}>
                            <Zap size={18} color="white" fill="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--brand-blue)' }}>PresupuestosYA</div>
                            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Panel profesional</div>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV.map(({ href, label, icon: Icon, highlight }) => {
                        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                        return (
                            <Link key={href} href={href} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: 10,
                                fontSize: 14, fontWeight: isActive ? 700 : 500, textDecoration: 'none',
                                transition: 'all 0.15s',
                                background: highlight
                                    ? 'linear-gradient(135deg, var(--brand-accent), #1d4ed8)'
                                    : isActive ? 'var(--gray-100)' : 'transparent',
                                color: highlight ? 'white' : isActive ? 'var(--brand-blue)' : 'var(--gray-500)',
                                boxShadow: highlight ? '0 2px 8px rgb(37 99 235 / 0.3)' : 'none',
                                marginTop: highlight ? 8 : 0
                            }}>
                                <Icon size={16} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid var(--gray-100)' }}>
                    <div style={{
                        background: 'var(--gray-50)', borderRadius: 10, padding: '10px 12px',
                        marginBottom: 8, fontSize: 13
                    }}>
                        <div style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: 4 }}>
                            {user.email?.split('@')[0]}
                        </div>
                        {plan === 'pro' ? (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 11, fontWeight: 700,
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white', padding: '2px 8px', borderRadius: 20
                            }}>
                                <Star size={9} fill="white" /> Plan PRO
                            </span>
                        ) : (
                            <Link href="/dashboard/upgrade" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 11, fontWeight: 700, textDecoration: 'none',
                                background: 'var(--brand-accent)',
                                color: 'white', padding: '2px 8px', borderRadius: 20
                            }}>
                                <Star size={9} fill="white" /> Pasate al Pro
                            </Link>
                        )}
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <LogOut size={14} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Mobile header (Simplified) */}
            <div style={{
                display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
                background: 'white', borderBottom: '1px solid var(--gray-200)',
                padding: '12px 16px', alignItems: 'center', justifyContent: 'center'
            }} className="mobile-header">
                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <Zap size={18} color="var(--brand-accent)" fill="var(--brand-accent)" />
                    <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--brand-blue)' }}>PresupuestosYA</span>
                </Link>
            </div>
 
            {/* Bottom Navbar (Mobile) */}
            <div style={{
                display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
                background: 'white', borderTop: '1px solid var(--gray-200)',
                padding: '10px 12px 24px', alignItems: 'center', justifyContent: 'space-around',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }} className="mobile-nav">
                {NAV.map(({ href, label, icon: Icon, highlight }) => {
                    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link key={href} href={href} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            textDecoration: 'none', color: highlight ? 'var(--brand-blue)' : isActive ? 'var(--brand-blue)' : 'var(--gray-400)',
                            flex: 1, position: 'relative'
                        }}>
                            {highlight ? (
                                <div style={{
                                    background: 'linear-gradient(135deg, var(--brand-accent), #1d4ed8)',
                                    width: 44, height: 44, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: -30, border: '4px solid white',
                                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                                }}>
                                    <Icon size={20} color="white" />
                                </div>
                            ) : (
                                <Icon size={20} />
                            )}
                            <span style={{ fontSize: 10, fontWeight: 700, marginTop: highlight ? 2 : 0 }}>
                                {label === 'Dashboard' ? 'Inicio' : label === 'Mi perfil' ? 'Perfil' : label.split(' ')[0]}
                            </span>
 
                            {isActive && !highlight && (
                                <div style={{
                                    position: 'absolute', top: -10, width: 4, height: 4,
                                    borderRadius: '50%', background: 'var(--brand-blue)'
                                }} />
                            )}
                        </Link>
                    )
                })}
            </div>
 
            {/* Main content */}
            <main style={{ flex: 1, minWidth: 0, paddingTop: 0 }}>
                <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
                    {children}
                </div>
            </main>
 
            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-nav { display: flex !important; }
          main > div { padding: 80px 16px 120px !important; }
        }
      `}</style>
        </div>
    )
}
