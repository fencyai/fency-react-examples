import { useChatCompletions } from '@fencyai/react'
import { useState } from 'react'
import { z } from 'zod'

const responseFormat = z.object({
    name: z.string(),
    age: z.number(),
})

export default function OpenaiStructuredChatCompletion() {
    const chatCompletions = useChatCompletions()
    const [result, setResult] = useState<z.infer<typeof responseFormat>>()

    const handleClick = async () => {
        const result = await chatCompletions.createStructuredChatCompletion({
            openai: {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content:
                            'Please tell me the name of a famous person and their age.',
                    },
                ],
            },
            responseFormat,
        })

        if (result.type === 'success') {
            setResult(result.chatCompletion.structuredResponse)
        }
    }

    return (
        <div>
            <button onClick={handleClick}>Send Message</button>
            {result && (
                <div>
                    <h2>Result</h2>
                    <pre className="text-xs">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                    People twice as old as {result.name} are {result.age * 2}
                </div>
            )}
        </div>
    )
}
