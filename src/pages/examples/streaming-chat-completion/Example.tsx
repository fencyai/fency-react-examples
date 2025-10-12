import { Response } from '@/components/ai-elements/response'
import { useStreamingChatCompletions } from '@fencyai/react'
import { Alert, Button, Textarea } from '@mantine/core'
import { IconAlertCircle, IconArrowDown } from '@tabler/icons-react'
import { useState } from 'react'

export default function Example() {
    const { createStreamingChatCompletion, latest } =
        useStreamingChatCompletions()
    const [prompt, setPrompt] = useState(
        'Show me a table of 5 famous actors and their most popular movies.'
    )

    // Get the response and loading state from the latest chat completion
    const response = latest?.response
    const loading = latest?.loading
    const error = latest?.error

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {response && <Response>{response}</Response>}
                {response == null && (
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
                    loading={loading}
                    onClick={() => {
                        createStreamingChatCompletion({
                            openai: {
                                messages: [
                                    {
                                        role: 'user',
                                        content: prompt,
                                    },
                                ],
                                model: "gpt-4.1-nano",
                            },
                        })
                    }}
                >
                    Send message
                </Button>
            </div>
            {error && (
                <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    title="Alert title"
                    icon={<IconAlertCircle />}
                    className="whitespace-pre-wrap"
                >
                    {error.message}
                </Alert>
            )}
        </div>
    )
}
