import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const bulkJobSchema = z.object({
  jobId: z.string().optional(),
  status: z.string().optional(),
  errorMessage: z.string().nullable().optional(),
  result: z
    .object({
      created: z.array(z.string()).optional(),
      updated: z.array(z.string()).optional(),
    })
    .optional(),
})

export async function getFencyMemoryBulkJob(jobId: string) {
  return fencyJson(
    `/v1/memories/jobs/${encodeURIComponent(jobId)}`,
    bulkJobSchema,
  )
}
