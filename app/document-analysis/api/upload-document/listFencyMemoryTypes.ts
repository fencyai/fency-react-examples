import 'server-only'

import { z } from 'zod'
import { fencyJson } from './fencyJson'

const memoryTypeItemSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const memoryTypesPageSchema = z.object({
  items: z.array(memoryTypeItemSchema).optional(),
  pagination: z
    .object({
      nextPageToken: z.string().nullable().optional(),
    })
    .optional(),
})

export async function listFencyMemoryTypes() {
  const items: Array<z.infer<typeof memoryTypeItemSchema>> = []
  let nextPageToken: string | undefined

  for (let page = 0; page < 20; page += 1) {
    const url = new URL('https://api.fency.ai/v1/memory-types')
    url.searchParams.set('limit', '50')
    if (nextPageToken) {
      url.searchParams.set('nextPageToken', nextPageToken)
    }

    const { ok, data } = await fencyJson(
      `${url.pathname}${url.search}`,
      memoryTypesPageSchema,
    )

    if (!ok) {
      throw new Error('Failed to list memory types')
    }

    items.push(...(data.items ?? []))
    nextPageToken = data.pagination?.nextPageToken ?? undefined
    if (!nextPageToken) {
      break
    }
  }

  return { items }
}
