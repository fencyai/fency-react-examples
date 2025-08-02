import { useChatCompletions } from '@fencyai/react'

export default function GeminiSynchronousChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createSynchronousChatCompletion({
            gemini: {
                model: 'gemini-2.5-flash-lite-preview-06-17',
                content: 'Hello, how are you?',
            },
        })
    }

    return (
        <div>
            <button onClick={handleClick}>Send Message</button>
            <pre className="text-xs">
                {JSON.stringify(chatCompletions, null, 2)}
            </pre>
        </div>
    )
} 