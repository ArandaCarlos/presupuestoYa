import { createAdminClient } from '../lib/supabase/admin'

async function checkPending() {
    const supabase = createAdminClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error)
        return
    }

    const pending = users.filter(u => !u.email_confirmed_at)
    console.log(`Found ${pending.length} pending users:`)
    pending.forEach(u => console.log(`- ${u.email} (${u.created_at})`))
}

checkPending()
