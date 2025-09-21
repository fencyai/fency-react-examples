import type { ApiError } from '@fencyai/js'
import { useChatCompletions, useWebsites } from '@fencyai/react'
import { CodeHighlight } from '@mantine/code-highlight'
import { Alert, Button, Loader, TextInput } from '@mantine/core'
import { IconAlertCircle, IconArrowDown } from '@tabler/icons-react'
import { useState } from 'react'
import z from 'zod'

const responseSchema = z.object({
    owningCompanyName: z.string(),
    mainPurposeOfWebsite: z.string(),
})

export default function Example() {
    const website = useWebsites()
    const { createStructuredChatCompletion, latest } = useChatCompletions()
    const [scrapingError, setScrapingError] = useState<ApiError | null>(null)
    const [isScraping, setIsScraping] = useState(false)
    const [url, setUrl] = useState('https://www.google.com')
    const [response, setResponse] = useState<z.infer<
        typeof responseSchema
    > | null>(null)

    // Get the response and loading state from the latest chat completion
    const loading = latest?.structured?.loading
    const error = latest?.structured?.error

    return (
        <div className="flex flex-col gap-2">
            <div className="h-96 overflow-y-auto">
                {response && (
                    <>
                        <CodeHighlight
                            code={JSON.stringify(response, null, 2)}
                            language="json"
                            radius="md"
                            background="transparent"
                        />
                    </>
                )}
                {response == null && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Waiting for your url!
                        </span>
                        <IconArrowDown className="text-gray-400" />
                    </div>
                )}
                {loading && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <span className="text-gray-500">
                            Loading response...
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
                    loading={loading || isScraping}
                    onClick={async () => {
                        setIsScraping(true)
                        const response = await website.scrapeContent({
                            url: url,
                        })
                        setIsScraping(false)
                        if (response.type === 'success') {
                            const structuredResponse =
                                await createStructuredChatCompletion({
                                    gemini: {
                                        content:
                                            'Extract the following information from the website: ' +
                                            response.website.content,
                                        model: 'gemini-2.5-flash-lite-preview-06-17',
                                    },
                                    responseFormat: responseSchema,
                                })
                            if (structuredResponse.type === 'success') {
                                setResponse(
                                    structuredResponse.data.structuredResponse
                                )
                            }
                        } else {
                            setScrapingError(response.error)
                        }
                    }}
                >
                    Summarize content
                </Button>
            </div>
            {scrapingError && (
                <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    title="Alert title"
                    icon={<IconAlertCircle />}
                    className="whitespace-pre-wrap"
                >
                    {scrapingError.message}
                </Alert>
            )}
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
