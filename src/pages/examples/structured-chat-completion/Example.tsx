import { useChatCompletions } from '@fencyai/react'
import { CodeHighlight } from '@mantine/code-highlight'
import { Alert, Button } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useState } from 'react'
import { z } from 'zod'

const responseSchema = z.object({
    actors: z.array(
        z.object({
            name: z.string(),
            birthYear: z.number(),
        })
    ),
})

export default function Example() {
    const { createStructuredChatCompletion, latest } = useChatCompletions()
    const [oldestActor, setOldestActor] = useState<string | null>(null)

    // Get the response and loading state from the latest chat completion
    const response = latest?.structured?.data?.response
    const loading = latest?.structured?.loading
    const error = latest?.structured?.error

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="min-h-96 overflow-y-auto bg-gray-100 p-2 rounded-md mb-2">
                {response && (
                    <>
                        <CodeHighlight
                            code={JSON.stringify(response, null, 2)}
                            language="json"
                            radius="md"
                            background="transparent"
                        />
                        <div className="text-gray-500">
                            <span className="font-bold">Oldest actor:</span>{' '}
                            {oldestActor}
                        </div>
                    </>
                )}
                {response == null && (
                    <div className="flex flex-col justify-center items-center w-full min-h-96">
                        <span className="text-gray-500">
                            {loading
                                ? 'Loading response...'
                                : 'Waiting for your input!'}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex gap-2 flex-wrap">
                <Button
                    radius={'xl'}
                    loading={loading}
                    color="indigo"
                    onClick={async () => {
                        const response = await createStructuredChatCompletion({
                            openai: {
                                messages: [
                                    {
                                        role: 'user',
                                        content:
                                            'Show me 3 different actors where each actor is born in a different year.',
                                    },
                                ],
                                model: 'gpt-4o',
                            },
                            responseFormat: responseSchema,
                        })
                        if (response.type === 'success') {
                            const oldestActor =
                                response.data.structuredResponse.actors.sort(
                                    (a, b) => a.birthYear - b.birthYear
                                )[0].name
                            setOldestActor(oldestActor)
                        }
                    }}
                >
                    Show me 3 different actors where each actor is born in a
                    different year.
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
