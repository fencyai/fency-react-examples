import 'server-only'

export async function uploadFileToS3(
  awsS3PostRequest: {
    key: string
    policy: string
    amzAlgorithm: string
    amzCredential: string
    amzDate: string
    amzSignature: string
    sessionToken: string
    uploadUrl: string
  },
  file: File,
) {
  const formData = new FormData()
  formData.append('key', awsS3PostRequest.key)
  formData.append('policy', awsS3PostRequest.policy)
  formData.append('x-amz-algorithm', awsS3PostRequest.amzAlgorithm)
  formData.append('x-amz-credential', awsS3PostRequest.amzCredential)
  formData.append('x-amz-date', awsS3PostRequest.amzDate)
  formData.append('x-amz-signature', awsS3PostRequest.amzSignature)
  formData.append('x-amz-security-token', awsS3PostRequest.sessionToken)
  formData.append('file', file)

  const response = await fetch(awsS3PostRequest.uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload file to S3 (${response.status}).`)
  }
}
