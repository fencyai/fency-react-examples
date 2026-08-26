import 'server-only'

import { z } from 'zod'

const fencyConversationSchema = z.object({
  id: z.string(),
  metadata: z.object({
    userId: z.string(),
  }),
})

export async function getFencyConversation(conversationId: string) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const response = await fetch(
    `https://api.fency.ai/v1/conversations/${encodeURIComponent(conversationId)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    },
  )
  if (!response.ok) {
    return { ok: false as const, status: response.status }
  }

  return {
    ok: true as const,
    data: fencyConversationSchema.parse(await response.json()),
  }
}
