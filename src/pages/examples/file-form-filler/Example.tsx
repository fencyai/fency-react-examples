import { useFiles, useStructuredChatCompletions } from '@fencyai/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Loader, TextInput } from '@mantine/core'
import { IconArrowUp, IconCheck } from '@tabler/icons-react'
import AwsS3 from '@uppy/aws-s3'
import Uppy from '@uppy/core'
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { Dashboard } from '@uppy/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    fullName: z.string(),
    email: z.string(),
    address: z.string(),
})

const suggestionsSchema = z.object({
    fullNames: z.array(z.string()),
    emails: z.array(z.string()),
    addresses: z.array(z.string()),
})

type ExampleState =
    | 'waiting_for_file'
    | 'getting_file_text_content'
    | 'getting_suggestions'
    | 'suggestions_received'

export default function Example() {
    const chatCompletions = useStructuredChatCompletions()
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [state, setState] = useState<ExampleState>('waiting_for_file')
    const [suggestions, setSuggestions] = useState<z.infer<
        typeof suggestionsSchema
    > | null>(null)
    const form = useForm({
        resolver: zodResolver(formSchema),
    })
    const { createFile } = useFiles({
        async onUploadCompleted() {
            setState('getting_file_text_content')
        },
        async onTextContentReady(event) {
            setState('getting_suggestions')
            const response =
                await chatCompletions.createStructuredChatCompletion({
                    responseFormat: suggestionsSchema,
                    openai: {
                        messages: [
                            {
                                role: 'user',
                                content:
                                    'Find suggestions for the following form based on this content. Make sure to include all the relevant datapoints you can find ' +
                                    event.textContent,
                            },
                        ],
                        model: 'gpt-4.1-nano',
                    },
                })

            if (response.type === 'success') {
                setSuggestions(response.data.structuredResponse)
                setState('suggestions_received')
            }
        },
    })

    const uppy = useMemo(() => {
        const u = new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ['application/pdf'],
            },
            autoProceed: false,
        })

        u.use(AwsS3, {
            getUploadParameters: async (file) => {
                if (file.size && file.name) {
                    const response = await createFile({
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                    })

                    if (response.type !== 'success') {
                        throw Error('Could not create upload')
                    }

                    const p = response.file
                    const fields: Record<string, string> = {
                        key: p.s3PostRequest.key,
                        policy: p.s3PostRequest.policy,
                        'x-amz-algorithm': p.s3PostRequest.xAmzAlgorithm,
                        'x-amz-credential': p.s3PostRequest.xAmzCredential,
                        'x-amz-date': p.s3PostRequest.xAmzDate,
                        'x-amz-signature': p.s3PostRequest.xAmzSignature,
                        'x-amz-security-token': p.s3PostRequest.sessionToken,
                    }

                    return {
                        url: p.s3PostRequest.uploadUrl,
                        method: 'POST',
                        fields,
                        headers: {},
                    }
                } else {
                    throw Error('Filename or size is null')
                }
            },
            shouldUseMultipart: false,
        })

        u.on('error', (error, file) => {
            console.log(
                `Error occured, ${error.name} ${error.message}, ${error.details}, ${file?.error}`
            )
        })

        return u
    }, [])

    const statusMeta = getStatusMeta(state)

    return (
        <div className="flex flex-col gap-2">
            <form
                onSubmit={form.handleSubmit(() => {
                    setFormSubmitted(true)
                })}
            >
                <TextInput
                    label="Full Name"
                    {...form.register('fullName')}
                    error={form.formState.errors.fullName?.message}
                />
                <Suggestions
                    suggestions={suggestions?.fullNames || []}
                    onClick={(fullName) => form.setValue('fullName', fullName)}
                />
                <TextInput
                    label="Email"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                />
                <Suggestions
                    suggestions={suggestions?.emails || []}
                    onClick={(email) => form.setValue('email', email)}
                />
                <TextInput
                    label="Address"
                    {...form.register('address')}
                    error={form.formState.errors.address?.message}
                />

                <Suggestions
                    suggestions={suggestions?.addresses || []}
                    onClick={(address) => form.setValue('address', address)}
                />
                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        loading={
                            state !== 'waiting_for_file' &&
                            state !== 'suggestions_received'
                        }
                    >
                        {statusMeta.text}
                    </Button>
                </div>
            </form>
            {formSubmitted && (
                <Alert
                    variant="light"
                    color="teal"
                    title="Form submitted successfully"
                    icon={<IconCheck />}
                >
                    Form submitted successfully.
                </Alert>
            )}
            <Dashboard uppy={uppy} />
        </div>
    )
}

function Suggestions({
    suggestions,
    onClick,
}: {
    suggestions: string[]
    onClick: (suggestion: string) => void
}) {
    return (
        <div className="flex gap-1 mt-2">
            {suggestions.map((suggestion) => (
                <Suggestion
                    key={suggestion}
                    value={suggestion}
                    onClick={() => onClick(suggestion)}
                />
            ))}
        </div>
    )
}

function Suggestion({
    value,
    onClick,
}: {
    value: string
    onClick: () => void
}) {
    return (
        <Button
            color="grape"
            size="xs"
            radius={'lg'}
            className="h-2"
            onClick={onClick}
        >
            {value}
        </Button>
    )
}

const getStatusMeta = (
    state: ExampleState
): {
    text: string
    icon: React.ReactNode
} => {
    switch (state) {
        case 'waiting_for_file':
            return {
                text: 'Waiting for your file!',
                icon: <IconArrowUp className="text-gray-400" />,
            }
        case 'getting_suggestions':
            return {
                text: 'Getting suggestions...',
                icon: <Loader color="blue" size="xs" />,
            }
        case 'suggestions_received':
            return {
                text: 'Suggestions received!',
                icon: <IconCheck className="text-gray-400" />,
            }
        case 'getting_file_text_content':
            return {
                text: 'Getting file text content...',
                icon: <Loader color="blue" size="xs" />,
            }
    }
}
