import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const awsS3PostRequestSchema = z.object({
  amzDate: z.string(),
  amzSignature: z.string(),
  amzAlgorithm: z.string(),
  amzCredential: z.string(),
  policy: z.string(),
  key: z.string(),
  uploadUrl: z.string(),
  sessionToken: z.string(),
})

const createdUploadSchema = z.object({
  awsS3PostRequest: awsS3PostRequestSchema,
})

export async function createFencyMemoryUpload(
  memoryId: string,
  body: {
    fileName: string
    fileSize: number
    mimeType: string
  },
) {
  const { ok, status, data } = await fencyJson(
    `/v1/memories/${memoryId}/uploads`,
    createdUploadSchema,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )

  if (!ok) {
    throw new Error(`Failed to create memory upload (${status}).`)
  }

  return data.awsS3PostRequest
}
