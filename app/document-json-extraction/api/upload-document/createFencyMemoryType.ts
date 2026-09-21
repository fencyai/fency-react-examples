import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const createdMemoryTypeSchema = z.object({
  id: z.string().optional(),
  error: z.object({ message: z.string().optional() }).optional(),
})

export async function createFencyMemoryType(body: {
  name: string
  description: string
  type: 'SEMANTIC'
}) {
  return fencyJson('/v1/memory-types', createdMemoryTypeSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
