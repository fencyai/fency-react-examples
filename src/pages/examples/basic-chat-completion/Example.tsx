import { Response } from '@/components/response'
import { useChatCompletions } from '@fencyai/react'
import { Button, Loader, Textarea } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'
import { useState } from 'react'

export default function Example() {
    const chatCompletions = useChatCompletions()
    const [prompt, setPrompt] = useState(
        'Show me a table of 5 famous actors and their most popular movies.'
    )

    // Get the response and loading state from the latest chat completion
    const response = chatCompletions.latest?.basic?.data?.response
    const loading = chatCompletions.latest?.basic?.loading

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {response && <Response>{response}</Response>}
                {response == null && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            {loading
                                ? 'Loading response...'
                                : 'Waiting for your first prompt!'}
                        </span>
                        {loading ? (
                            <Loader className="text-gray-400" size="xs" />
                        ) : (
                            <IconArrowDown className="text-gray-400" />
                        )}
                    </div>
                )}
            </div>
            <Textarea
                placeholder="Ask me anything..."
                value={prompt}
                onChange={(event) => {
                    setPrompt(event.target.value)
                }}
            />
            <div className="flex justify-end">
                <Button
                    loading={loading}
                    onClick={() => {
                        chatCompletions.createChatCompletion({
                            openai: {
                                messages: [
                                    {
                                        role: 'user',
                                        content: prompt,
                                    },
                                ],
                                model: 'gpt-4o',
                            },
                        })
                    }}
                >
                    Send message
                </Button>
            </div>
        </div>
    )
}
