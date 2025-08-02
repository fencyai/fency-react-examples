import { useChatCompletions } from '@fencyai/react'

export default function GeminiStreamingChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        const result = await chatCompletions.createStreamingChatCompletion({
            gemini: {
                model: 'gemini-2.5-flash-lite-preview-06-17',
                content: 'Please write a short story about a cat using 200 words.',
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
