import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from './DashboardLayoutClient'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Sin sesión → login
    if (!user) {
        redirect('/login')
    }

    // Sin perfil → onboarding obligatorio
    const { data: professional } = await supabase
        .from('professionals')
        .select('id, plan')
        .eq('user_id', user.id)
        .maybeSingle()

    if (!professional) {
        redirect('/onboarding')
    }

    return <DashboardLayoutClient user={user} plan={professional.plan}>{children}</DashboardLayoutClient>
}
