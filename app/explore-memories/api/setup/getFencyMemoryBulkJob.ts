import 'server-only'

import { fencyJson } from './fencyRequest'

export type FencyMemoryBulkJob = {
  jobId?: string
  status?: string
  errorMessage?: string | null
  result?: {
    created?: string[]
    updated?: string[]
    skipped?: Array<{ identityValue: string; reason: string }>
  }
}

export async function getFencyMemoryBulkJob(jobId: string) {
  return fencyJson<FencyMemoryBulkJob>(
    `/v1/memories/jobs/${encodeURIComponent(jobId)}`,
  )
}
