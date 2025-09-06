import { Response } from '@/components/response'
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
                            'Show a table of 3 hollywood actors and their ages.',
                    },
                ],
            },
        })
    }

    return (
        <div className="m-2">
            <button onClick={handleClick}>Write a story</button>
            {chatCompletions.latest?.response && (
                <Response>{chatCompletions.latest.response}</Response>
            )}
        </div>
    )
}
