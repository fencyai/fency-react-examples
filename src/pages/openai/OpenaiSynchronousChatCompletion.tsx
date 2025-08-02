import { useChatCompletions } from '@fencyai/react'

export default function OpenaiSynchronousChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createSynchronousChatCompletion({
            openai: {
                model: 'gpt-4o-mini',
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
