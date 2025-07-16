import { useChatCompletion } from '@fencyai/react'

export default function StreamingChatCompletion() {
    const chatCompletions = useChatCompletion()

    const handleClick = async () => {
        const result = await chatCompletions.createStreamingChatCompletion({
            openai: {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: 'Please write a short story about a cat.',
                    },
                ],
            },
        })

        console.log(result)
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
