import { Response } from '@/components/response'
import { useStreamingChatCompletions, useWebsites } from '@fencyai/react'
import { Alert, Button, Loader, TextInput } from '@mantine/core'
import { IconAlertCircle, IconArrowDown } from '@tabler/icons-react'
import { useState } from 'react'

export default function Example() {
    const { createStreamingChatCompletion, latest } =
        useStreamingChatCompletions()
    const { createWebsite } = useWebsites({
        async onTextContentReady(event) {
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
    const [isScraping, setIsScraping] = useState(false)
    const [url, setUrl] = useState('https://google.com')

    // Get the response and loading state from the latest chat completion
    const loading = latest?.loading
    const error = latest?.error

    const state = getState({
        isScraping,
        loading: loading ?? false,
        response: latest?.response ?? null,
    })

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {latest?.response && <Response>{latest.response}</Response>}
                {state === 'waiting_for_url' && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Waiting for your url!
                        </span>
                        <IconArrowDown className="text-gray-400" />
                    </div>
                )}
                {state === 'scraping' && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Scraping website...
                        </span>
                        <Loader size="xs" />
                    </div>
                )}
                {state === 'loading' && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Summarizing website content...
                        </span>
                        <Loader size="xs" />
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
                    disabled={
                        state !== 'waiting_for_url' && state !== 'summarizing'
                    }
                    onClick={async () => {
                        setIsScraping(true)
                        await createWebsite({
                            url: url,
                        })
                    }}
                >
                    Summarize content
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

const getState = (values: {
    isScraping: boolean
    loading: boolean
    response: string | null
}): 'scraping' | 'loading' | 'summarizing' | 'waiting_for_url' => {
    if (values.response && values.response.length > 0) {
        return 'summarizing'
    }
    if (values.isScraping) {
        return 'scraping'
    }
    if (values.loading) {
        return 'loading'
    }
    return 'waiting_for_url'
}
