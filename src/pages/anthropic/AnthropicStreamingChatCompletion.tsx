import { useChatCompletions } from '@fencyai/react'

export default function AnthropicStreamingChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createStreamingChatCompletion({
            anthropic: {
                model: 'claude-sonnet-4-0',
                messages: [
                    {
                        role: 'user',
                        content:
                            'Please write a short story about a cat using 200 words.',
                    },
                ],
            },
        })
    }

    return (
        <div className="m-2">
            <button onClick={handleClick}>Send Message</button>
            <div className="whitespace-pre-wrap max-w-lg">
                {chatCompletions.latestCompletion?.fullMessage}
            </div>
        </div>
    )
}
