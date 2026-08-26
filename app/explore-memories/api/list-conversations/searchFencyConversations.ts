import 'server-only'

import { z } from 'zod'

const conversationItemSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  createdAt: z.string().optional(),
})

const searchConversationsSchema = z.object({
  items: z.array(conversationItemSchema).optional(),
})

export async function searchFencyConversations(userId: string) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const url = new URL('https://api.fency.ai/v1/conversations/search')
  url.searchParams.set('asc', 'false')
  url.searchParams.set('limit', '50')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metadata: { userId },
    }),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error('Failed to search conversations')
  }

  const data = searchConversationsSchema.parse(await response.json())
  return data.items ?? []
}
