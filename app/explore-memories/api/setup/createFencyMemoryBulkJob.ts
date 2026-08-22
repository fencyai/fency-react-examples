import 'server-only'

import { fencyJson } from './fencyRequest'

export async function createFencyMemoryBulkJob(body: {
  memoryTypeId: string
  memories: Array<{ title: string; metadata: Record<string, unknown> }>
}) {
  return fencyJson<{ jobId?: string; error?: { message?: string } }>(
    '/v1/memories/jobs',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}
