import { createAdminClient } from '../lib/supabase/admin'

async function checkRecent() {
    const supabase = createAdminClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error:', error)
        return
    }

    const unconfirmed = users.filter(u => !u.email_confirmed_at)
    console.log(`Total unconfirmed: ${unconfirmed.length}`)
    
    // Sort by created_at desc
    const recent = [...unconfirmed].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 10)

    console.log('Most recent unconfirmed:')
    recent.forEach(u => console.log(`- ${u.email} (${u.created_at})`))
}

checkRecent()
