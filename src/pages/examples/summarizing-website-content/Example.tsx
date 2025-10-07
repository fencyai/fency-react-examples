import { Response } from '@/components/ai-elements/response'
import { useStreamingChatCompletions, useWebsites } from '@fencyai/react'
import { Alert, Button, Loader, TextInput } from '@mantine/core'
import { IconAlertCircle, IconArrowDown, IconCheck } from '@tabler/icons-react'
import { useState } from 'react'

type ExampleState =
    | 'waiting_for_url'
    | 'getting_html_content'
    | 'getting_text_content'
    | 'summarizing'
    | 'summarizing_completed'

export default function Example() {
    const [url, setUrl] = useState('https://google.com')
    const [state, setState] = useState<ExampleState>('waiting_for_url')
    const { createStreamingChatCompletion, latest } =
        useStreamingChatCompletions({
            onChatCompletionStreamCompleted() {
                console.log('onChatCompletionStreamCompleted')
                setState('summarizing_completed')
            },
        })
    const { createWebsite } = useWebsites({
        async onHtmlContentReady() {
            console.log('onHtmlContentReady')
            setState('getting_text_content')
        },
        async onTextContentReady(event) {
            console.log('onTextContentReady')
            setState('summarizing')
            await createStreamingChatCompletion({
                gemini: {
                    messages: [
                        {
                            role: 'user',
                            content:
                                'Give a short summary of the following website: ' +
                                event.textContent,
                        },
                    ],
                    model: 'gemini-2.5-flash-lite-preview-06-17',
                },
            })
        },
    })

    const stateMeta = getStateMeta(state)

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {latest?.response && <Response>{latest.response}</Response>}
                {latest?.response == null && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">{stateMeta.title}</span>
                        {stateMeta.icon}
                    </div>
                )}
            </div>
            <TextInput
                placeholder="Enter a website URL..."
                value={url}
                onChange={(event) => {
                    setUrl(event.target.value)
                }}
            />
            <div className="flex justify-end">
                <Button
                    loading={state !== 'waiting_for_url' && state !== 'summarizing_completed'}
                    onClick={async () => {
                        setState('getting_html_content')
                        await createWebsite({
                            url: url,
                        })
                    }}
                >
                    Summarize content
                </Button>
            </div>
            {latest?.error && (
                <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    title="Alert title"
                    icon={<IconAlertCircle />}
                    className="whitespace-pre-wrap"
                >
                    {latest.error.message}
                </Alert>
            )}
        </div>
    )
}

const getStateMeta = (
    state: ExampleState
): {
    title: string
    icon: React.ReactNode
} => {
    switch (state) {
        case 'waiting_for_url':
            return {
                title: 'Waiting for your url!',
                icon: <IconArrowDown className="text-gray-400" />,
            }
        case 'getting_html_content':
            return {
                title: 'Getting website content...',
                icon: <Loader size="xs" />,
            }
        case 'getting_text_content':
            return {
                title: 'Getting website content...',
                icon: <Loader size="xs" />,
            }
        case 'summarizing':
            return {
                title: 'Summarizing website content...',
                icon: <Loader size="xs" />,
            }
        case 'summarizing_completed':
            return {
                title: 'Summarizing website content completed!',
                icon: <IconCheck className="text-gray-400" />,
            }
    }
}
