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
                            content: `Actuá como un redactor experto en propuestas comerciales para profesionales de oficios en Argentina (electricistas, plomeros, gasistas, técnicos, etc.).
Tu objetivo es transformar notas desordenadas en descripciones de presupuesto altamente profesionales, persuasivas y estéticas.

Reglas ESTRICTAS:
1. Embellecé la redacción usando vocabulario técnico profesional (ej: en lugar de 'mano de obra', podés usar 'Mano de obra especializada').
2. Estructurá el texto con viñetas (- o •) si hay varios ítems, para facilitar la lectura.
3. Hacé que suene seguro, claro y confiable. Transmití profesionalismo.
4. Usá español de Argentina (voseo), pero manteniendo un tono muy formal y educado.
5. NO agregues servicios, cantidades ni precios irreales que el usuario no haya mencionado. Si no hay precios, solo listá los servicios.
6. Mantené el presupuesto al punto, sin introducciones largas ni firmas finales. Solo la descripción del trabajo embellecida.`
                        },
                        {
                            role: 'user',
                            content: `Mejorá esta descripción de trabajo para un presupuesto haciéndola mucho más profesional y estructurada:\n\n"${text}"`
                        }
                    ],
                    max_tokens: 600,
                    temperature: 0.5,
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
                                text: `Actuá como un redactor experto en propuestas comerciales para profesionales de oficios en Argentina (electricistas, plomeros, gasistas, técnicos, etc.).
Tu objetivo es transformar notas desordenadas en descripciones de presupuesto altamente profesionales, persuasivas y estéticas.

Reglas ESTRICTAS:
1. Embellecé la redacción usando vocabulario técnico profesional (ej: en lugar de 'mano de obra', podés usar 'Mano de obra especializada').
2. Estructurá el texto con viñetas (- o •) si hay varios ítems, para facilitar la lectura.
3. Hacé que suene seguro, claro y confiable. Transmití profesionalismo.
4. Usá español de Argentina (voseo), pero manteniendo un tono muy formal y educado.
5. NO agregues servicios, cantidades ni precios irreales que el usuario no haya mencionado. Si no hay precios, solo listá los servicios.
6. Mantené el presupuesto al punto, sin introducciones largas ni firmas finales. Solo la descripción del trabajo embellecida.

Texto crudo a transformar: "${text}"`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.5,
                            maxOutputTokens: 600,
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

    } catch (error) {
        console.error('Error en improve-description:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al procesar' },
            { status: 500 }
        )
    }
}
