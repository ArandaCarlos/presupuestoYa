import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
    console.log('Verificando profesional: edad165f-a109-4ce1-8181-f39c914c8e98')
    const { data: prof, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', 'edad165f-a109-4ce1-8181-f39c914c8e98')
        .single()
        
    console.log('En BBDD Actual:', prof?.plan, prof?.subscription_status)
    
    // Forzamos la actualización para asegurar que la DB responde
    const date = new Date()
    date.setDate(date.getDate() + 30)

    console.log('Aplicando upgrade manual...')
    const { error: updateErr } = await supabase
        .from('professionals')
        .update({
            plan: 'pro',
            subscription_status: 'activo',
            subscription_expires_at: date.toISOString(),
        })
        .eq('id', 'edad165f-a109-4ce1-8181-f39c914c8e98')

    if (updateErr) console.error(updateErr)
    else console.log('¡Actualizado con éxito manualmente en DB!')
}

run()
