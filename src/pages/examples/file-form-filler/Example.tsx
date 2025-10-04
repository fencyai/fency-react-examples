import type { FencyFile } from '@fencyai/js'
import {
    useFiles,
    useStructuredChatCompletions,
    type UseStructuredChatCompletions,
} from '@fencyai/react'
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
    name: z.string(),
    email: z.string(),
    phone: z.string(),
})

export default function Example() {
    const chatCompletions = useStructuredChatCompletions()
    const [formSubmitted, setFormSubmitted] = useState(false)
    const form = useForm({
        resolver: zodResolver(formSchema),
    })
    const { createFile, files } = useFiles({
        async onTextContentReady(event) {
            const response =
                await chatCompletions.createStructuredChatCompletion({
                    responseFormat: formSchema,
                    openai: {
                        messages: [
                            {
                                role: 'user',
                                content:
                                    'Fill out the following form based on this content: ' +
                                    event.textContent,
                            },
                        ],
                        model: 'gpt-4.1-nano',
                    },
                })

            if (response.type === 'success') {
                form.reset(response.data.structuredResponse)
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

    const statusMeta = getStatusMeta(files, chatCompletions)

    return (
        <div className="flex flex-col gap-2">
            <form
                onSubmit={form.handleSubmit(() => {
                    setFormSubmitted(true)
                })}
            >
                <TextInput
                    label="Name"
                    {...form.register('name')}
                    error={form.formState.errors.name?.message}
                />
                <TextInput
                    label="Email"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                />
                <TextInput
                    label="Phone"
                    {...form.register('phone')}
                    error={form.formState.errors.phone?.message}
                />
                <div className="flex justify-end pt-2">
                    <Button type="submit">{statusMeta.status}</Button>
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

const getStatusMeta = (
    files: FencyFile[],
    chatCompletions: UseStructuredChatCompletions
): {
    status: string
    icon: React.ReactNode
} => {
    let statusMeta: {
        status: string
        icon: React.ReactNode
    } = {
        status: 'Waiting for your file!',
        icon: <IconArrowUp className="text-gray-400" />,
    }
    if (files.length > 0) {
        if (files[0].content == null) {
            statusMeta = {
                status: 'Uploading your file...',
                icon: <Loader color="blue" size="xs" />,
            }
        }
        if (files[0].content != null) {
            statusMeta = {
                status: 'Getting the text content of your file...',
                icon: <Loader color="blue" size="xs" />,
            }
        }
    }
    if (chatCompletions.latest?.data?.response) {
        statusMeta = {
            status: 'Filling out the form...',
            icon: <Loader color="blue" size="xs" />,
        }
    }
    return statusMeta
}
