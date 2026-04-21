import { createAdminClient } from '../lib/supabase/admin'

const DRY_RUN = process.env.DRY_RUN !== 'false'

async function rescueUsers() {
    const supabase = createAdminClient()
    
    console.log(`[Rescue] Fetching all users... (DRY_RUN: ${DRY_RUN})`)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('[Rescue] Error listing users:', error)
        return
    }

    const unconfirmed = users.filter(u => !u.email_confirmed_at)
    console.log(`[Rescue] Found ${unconfirmed.length} unconfirmed users.`)

    if (unconfirmed.length === 0) {
        console.log('[Rescue] No users to rescue. Done.')
        return
    }

    for (const user of unconfirmed) {
        if (!user.email) continue

        if (DRY_RUN) {
            console.log(`[DRY RUN] Would resend confirmation to: ${user.email} (Created: ${user.created_at})`)
        } else {
            console.log(`[LIVE] Resending confirmation to: ${user.email}...`)
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
                }
            })
            
            if (resendError) {
                console.error(`[ERROR] Failed to resend to ${user.email}:`, resendError.message)
            } else {
                console.log(`[SUCCESS] Resent email to ${user.email}`)
            }
            
            // Wait a bit to avoid hitting rate limits too fast
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }
    
    if (DRY_RUN) {
        console.log('\n[INFO] To execute for real, run with DRY_RUN=false')
    }
}

rescueUsers()
