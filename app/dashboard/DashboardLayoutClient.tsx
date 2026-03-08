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
    children, user
}: {
    children: React.ReactNode
    user: User
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-accent))',
                            borderRadius: 10, padding: 8, display: 'flex'
                        }}>
                            <Zap size={18} color="white" fill="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--brand-blue)' }}>PresupuestoYA</div>
                            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Panel profesional</div>
                        </div>
                    </div>
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
                        <Link href="/dashboard/upgrade" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 700, textDecoration: 'none',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white', padding: '2px 8px', borderRadius: 20
                        }}>
                            <Star size={9} fill="white" /> Pasate al Pro
                        </Link>
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <LogOut size={14} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div style={{
                display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
                background: 'white', borderBottom: '1px solid var(--gray-200)',
                padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between'
            }} className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={18} color="var(--brand-accent)" fill="var(--brand-accent)" />
                    <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--brand-blue)' }}>PresupuestoYA</span>
                </div>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {menuOpen ? <X size={22} color="var(--gray-700)" /> : <Menu size={22} color="var(--gray-700)" />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 30,
                    background: 'white', paddingTop: 60, display: 'flex', flexDirection: 'column'
                }}>
                    <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {NAV.map(({ href, label, icon: Icon, highlight }) => (
                            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '14px 16px', borderRadius: 12, fontSize: 15,
                                fontWeight: 600, textDecoration: 'none',
                                background: highlight ? 'linear-gradient(135deg, var(--brand-accent), #1d4ed8)' : 'transparent',
                                color: highlight ? 'white' : 'var(--gray-700)',
                                marginTop: highlight ? 8 : 0
                            }}>
                                <Icon size={18} />
                                {label}
                                {!highlight && <ChevronRight size={16} style={{ marginLeft: 'auto' }} color="var(--gray-300)" />}
                            </Link>
                        ))}
                    </nav>
                    <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid var(--gray-100)' }}>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            <LogOut size={16} /> Cerrar sesión
                        </button>
                    </div>
                </div>
            )}

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
          main > div { padding: 80px 16px 32px !important; }
        }
      `}</style>
        </div>
    )
}
