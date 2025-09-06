import { Response } from '@/components/response'
import { useChatCompletions } from '@fencyai/react'

export default function GeminiStreamingChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createStreamingChatCompletion({
            gemini: {
                model: 'gemini-2.5-flash-lite-preview-06-17',
                content:
                    'Please write a short story about a cat using 200 words.',
            },
        })
    }

    return (
        <div className="m-2">
            <button onClick={handleClick}>Send Message</button>
            <div className="whitespace-pre-wrap max-w-lg">
                {chatCompletions.latest?.response && (
                    <Response>{chatCompletions.latest.response}</Response>
                )}
            </div>
        </div>
    )
}
