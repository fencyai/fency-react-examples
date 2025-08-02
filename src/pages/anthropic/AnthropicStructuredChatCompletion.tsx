import { useChatCompletions } from '@fencyai/react'
import { useState } from 'react'
import { z } from 'zod'

const responseFormat = z.object({
    name: z.string(),
    age: z.number(),
})

export default function AnthropicStructuredChatCompletion() {
    const chatCompletions = useChatCompletions()
    const [result, setResult] = useState<z.infer<typeof responseFormat>>()

    const handleClick = async () => {
        const result = await chatCompletions.createStructuredChatCompletion({
            anthropic: {
                model: 'claude-sonnet-4-0',
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

        setResult(result.structuredResponse)
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
                </div>
            )}
        </div>
    )
}
