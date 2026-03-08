import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json()

        if (!text || text.trim().length < 5) {
            return NextResponse.json({ error: 'Texto muy corto' }, { status: 400 })
        }

        const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY

        if (!apiKey) {
            return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })
        }

        // Usar OpenAI si hay OPENAI_API_KEY, sino usar Gemini
        if (process.env.OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `Sos un asistente para profesionales de oficios en Argentina (electricistas, plomeros, gasistas, pintores, etc.).
Tu tarea es mejorar la redacción de descripciones de trabajos para presupuestos profesionales.

Reglas ESTRICTAS:
- NO inventés ni agregues información que no esté en el texto original
- NO cambies precios, cantidades, materiales ni datos específicos
- SÍ corregí ortografía y puntuación
- SÍ mejorá la redacción para que suene profesional y clara
- SÍ organizá mejor las oraciones si es necesario
- Usá español de Argentina (vos, etc.)
- El resultado debe ser directo, sin explicaciones ni comentarios tuyos
- Longitud similar al original, no agregues párrafos extra`
                        },
                        {
                            role: 'user',
                            content: `Mejorá esta descripción de trabajo para un presupuesto:\n\n"${text}"`
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.3,
                }),
            })

            if (!response.ok) {
                throw new Error(`OpenAI error: ${response.status}`)
            }

            const data = await response.json()
            const improved = data.choices[0]?.message?.content?.trim()

            if (!improved) throw new Error('Respuesta vacía de OpenAI')

            return NextResponse.json({ improved })

        } else if (process.env.GEMINI_API_KEY) {
            // Usar Gemini como alternativa gratuita
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Sos un asistente para profesionales de oficios en Argentina (electricistas, plomeros, gasistas, pintores, etc.).
Tu tarea es mejorar la redacción de esta descripción de trabajo para un presupuesto profesional.

REGLAS:
- NO inventés información que no esté en el texto
- NO cambies precios, cantidades ni materiales específicos
- SÍ corregí ortografía y puntuación
- SÍ hacé la redacción más clara y profesional
- Usá español argentino
- Respondé SOLO con el texto mejorado, sin comentarios

Texto a mejorar: "${text}"`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 500,
                        }
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(`Gemini error: ${response.status}`)
            }

            const data = await response.json()
            const improved = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

            if (!improved) throw new Error('Respuesta vacía de Gemini')

            return NextResponse.json({ improved })
        }

        return NextResponse.json({ error: 'Sin API key configurada' }, { status: 500 })

    } catch (error: any) {
        console.error('Error en improve-description:', error)
        return NextResponse.json(
            { error: error.message || 'Error al procesar' },
            { status: 500 }
        )
    }
}
