import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const createdBulkJobSchema = z.object({
  jobId: z.string().optional(),
  error: z.object({ message: z.string().optional() }).optional(),
})

export async function createFencyMemoryBulkJob(body: {
  memoryTypeId: string
  memories: Array<{ title: string; metadata: Record<string, unknown> }>
}) {
  return fencyJson('/v1/memories/jobs', createdBulkJobSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
