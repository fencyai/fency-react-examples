import { useChatCompletions } from '@fencyai/react'

export default function AnthropicSynchronousChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createSynchronousChatCompletion({
            anthropic: {
                model: 'claude-sonnet-4-0',
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, how are you?',
                    },
                ],
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