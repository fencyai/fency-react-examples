import 'server-only'

import { fencyJson } from './fencyRequest'

export async function getFencyMemory(memoryId: string) {
  return fencyJson<{
    id?: string
    metadata?: { id?: unknown }
  }>(`/v1/memories/${encodeURIComponent(memoryId)}`)
}
