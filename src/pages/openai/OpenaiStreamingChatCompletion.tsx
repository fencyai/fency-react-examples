import { useChatCompletions } from '@fencyai/react'

export default function OpenaiStreamingChatCompletion() {
    const chatCompletions = useChatCompletions()

    const handleClick = async () => {
        await chatCompletions.createStreamingChatCompletion({
            openai: {
                model: 'gpt-4o-mini',
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
            <button onClick={handleClick}>Write a story</button>
            <div className="whitespace-pre-wrap max-w-lg">
                {chatCompletions.latest?.response}
            </div>
        </div>
    )
}
