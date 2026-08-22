import 'server-only'

import { fencyJson } from './fencyRequest'

export async function createFencyMemoryType(body: {
  name: string
  description: string
  type: 'METADATA'
  identityKeyName: string
  updatedAtKeyName: string
}) {
  return fencyJson<{ id?: string; error?: { message?: string } }>(
    '/v1/memory-types',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}
