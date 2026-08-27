import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const createdMemorySchema = z.object({
  id: z.string(),
})

export async function createFencyFileMemory(body: {
  memoryTypeId: string
  title: string
  metadata: Record<string, string>
}) {
  const { ok, status, data } = await fencyJson(
    '/v1/memories',
    createdMemorySchema,
    {
      method: 'POST',
      body: JSON.stringify({
        memoryTypeId: body.memoryTypeId,
        sourceType: 'FILE',
        title: body.title,
        metadata: body.metadata,
      }),
    },
  )

  if (!ok) {
    throw new Error(`Failed to create file memory (${status}).`)
  }

  return data
}
