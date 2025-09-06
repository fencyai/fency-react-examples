import { Response } from '@/components/response'
import { useChatCompletions } from '@fencyai/react'
import { Button, Textarea } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'
import { useState } from 'react'

export default function Example() {
    const chatCompletions = useChatCompletions()
    const [prompt, setPrompt] = useState(
        'Show me a table of 5 famous actors and their most popular movies.'
    )

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {chatCompletions.latest?.streaming?.response && (
                    <Response>
                        {chatCompletions.latest?.streaming?.response}
                    </Response>
                )}
                {chatCompletions.latest?.streaming?.response == null && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Waiting for your first prompt!
                        </span>
                        <IconArrowDown className="text-gray-400" />
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
                    loading={chatCompletions.latest?.streaming?.loading}
                    onClick={() => {
                        chatCompletions.createStreamingChatCompletion({
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
