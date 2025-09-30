import { useChatCompletions, useFileUploads } from '@fencyai/react'
import { Loader } from '@mantine/core'
import { IconAlertCircle, IconArrowUp } from '@tabler/icons-react'
import AwsS3 from '@uppy/aws-s3'
import Uppy, { type Meta, type UppyFile } from '@uppy/core'
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { Dashboard } from '@uppy/react'
import { useMemo } from 'react'

export default function Example() {
    const chatCompletions = useChatCompletions()
    const { createFileUpload, fileUploads } = useFileUploads({
        onFileTextContentReady(fileTextContentReady) {
            chatCompletions.createStreamingChatCompletion({
                openai: {
                    messages: [
                        {
                            role: 'user',
                            content:
                                'Summarize the following file content: ' +
                                fileTextContentReady.text,
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
                    const response = await createFileUpload({
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                    })

                    if (response.type !== 'success') {
                        throw Error('Could not create upload')
                    }

                    const p = response.upload
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

        // Optional: see final URLs
        u.on(
            'upload-success',
            (
                file: UppyFile<Meta, Record<string, never>> | undefined,
                response: NonNullable<
                    | {
                          body?: Record<string, never>
                          status: number
                          bytesUploaded?: number
                          uploadURL?: string
                      }
                    | undefined
                >
            ) => {
                // For presigned PUT, the S3 object URL is usually the presign URL without the querystring, or build it yourself:
                // Safer: store `key` on server side return & compose CDN/public URL from it (if you have one).
                console.log('Uploaded:', file?.name, response)
            }
        )

        u.on('error', (error, file) => {
            console.log(
                `Error occured, ${error.name} ${error.message}, ${error.details}, ${file?.error}`
            )
        })

        return u
    }, [])

    let statusMeta: {
        status: string
        icon: React.ReactNode
    } = {
        status: 'Waiting for your file!',
        icon: <IconArrowUp className="text-gray-400" />,
    }
    if (fileUploads.length > 0) {
        if (fileUploads[0].status === 'uploading') {
            statusMeta = {
                status: 'Uploading your file...',
                icon: <Loader color="blue" size="xs" />,
            }
        }
        if (fileUploads[0].status === 'upload_complete') {
            statusMeta = {
                status: 'Getting the text content of your file...',
                icon: <Loader color="blue" size="xs" />,
            }
        }
        if (fileUploads[0].status === 'upload_failed') {
            statusMeta = {
                status: 'Failed to upload your file...',
                icon: <IconAlertCircle className="text-gray-400" />,
            }
        }
    }
    if (chatCompletions.latest.response) {
        statusMeta = {
            status: 'Summarizing your file content...',
            icon: <Loader color="blue" size="xs" />,
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <Dashboard uppy={uppy} />
            <div className="min-h-36 overflow-y-auto bg-gray-100 p-4 rounded-md mb-2 flex flex-col justify-center items-center">
                {chatCompletions.latest.response}
                {(chatCompletions.latest.response == null ||
                    chatCompletions.latest.response?.length === 0) && (
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
