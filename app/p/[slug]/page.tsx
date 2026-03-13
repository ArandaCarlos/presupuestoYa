import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicQuoteView from './PublicQuoteView'
import type { Quote } from '@/lib/types'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    return {
        title: `Presupuesto #${slug.toUpperCase()} — PresupuestosYA`,
        description: 'Revisá y aceptá tu presupuesto online',
    }
}

export default async function PublicQuotePage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: quote, error } = await supabase
        .from('quotes')
        .select('*, professionals(*)')
        .eq('slug', slug)
        .in('status', ['sent', 'viewed', 'accepted', 'rejected'])
        .single()

    if (error || !quote) {
        notFound()
    }

    // Marcar como visto si estaba en "sent"
    if (quote.status === 'sent') {
        await supabase
            .from('quotes')
            .update({ status: 'viewed', viewed_at: new Date().toISOString() })
            .eq('slug', slug)

        quote.status = 'viewed'
    }

    return <PublicQuoteView quote={quote as Quote} />
}
