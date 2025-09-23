import { useFileUploads } from '@fencyai/react'
import AwsS3 from '@uppy/aws-s3'
import Uppy, { type Meta, type UppyFile } from '@uppy/core'
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { Dashboard } from '@uppy/react'
import { useMemo } from 'react'

export default function Example() {
    const { fileUploads, createFileUpload } = useFileUploads({
        onUploadComplete(fileUpload) {
            console.log('Upload complete', fileUpload)
        },
        onFileTextContentReady(fileTextContentReady) {
            console.log('File text content ready', fileTextContentReady)
        },
    })

    const uppy = useMemo(() => {
        const u = new Uppy({
            restrictions: {
                maxNumberOfFiles: 10,
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

    return (
        <div className="flex flex-col gap-2">
            <Dashboard uppy={uppy} />
            {JSON.stringify(fileUploads, null, 2)}
        </div>
    )
}
