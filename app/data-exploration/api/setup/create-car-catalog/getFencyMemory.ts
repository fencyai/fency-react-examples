import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const memorySchema = z.object({
  id: z.string().optional(),
  metadata: z.object({ id: z.unknown().optional() }).optional(),
})

export async function getFencyMemory(memoryId: string) {
  return fencyJson(
    `/v1/memories/${encodeURIComponent(memoryId)}`,
    memorySchema,
  )
}
