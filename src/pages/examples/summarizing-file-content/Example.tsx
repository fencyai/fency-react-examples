import { Response } from '@/components/ai-elements/response'
import type { FencyFile } from '@fencyai/js'
import { useFiles, useStreamingChatCompletions } from '@fencyai/react'
import { Loader } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'
import AwsS3 from '@uppy/aws-s3'
import Uppy from '@uppy/core'
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { Dashboard } from '@uppy/react'
import type { UseStreamingChatCompletions } from 'node_modules/@fencyai/react/lib/types/UseStreamingChatCompletions'
import { useMemo } from 'react'

export default function Example() {
    const chatCompletions = useStreamingChatCompletions()
    const { createFile, files } = useFiles({
        onTextContentReady(event) {
            chatCompletions.createStreamingChatCompletion({
                openai: {
                    messages: [
                        {
                            role: 'user',
                            content:
                                'Summarize the following file content: ' +
                                event.textContent,
                        },
                    ],
                    model: 'gpt-4.1-nano',
                },
            })
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
            <Dashboard uppy={uppy} />
            <div className="min-h-36 overflow-y-auto bg-gray-100 p-4 rounded-md mb-2 flex flex-col justify-center items-center">
                {chatCompletions.latest?.response && (
                    <Response>{chatCompletions.latest.response}</Response>
                )}
                {(chatCompletions.latest?.response == null ||
                    chatCompletions.latest?.response?.length === 0) && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        {statusMeta.icon}
                        <span className="text-gray-500">
                            {statusMeta.status}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

const getStatusMeta = (
    files: FencyFile[],
    chatCompletions: UseStreamingChatCompletions
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
    }
    if (chatCompletions.latest?.response) {
        statusMeta = {
            status: 'Summarizing your file content...',
            icon: <Loader color="blue" size="xs" />,
        }
    }
    return statusMeta
}
