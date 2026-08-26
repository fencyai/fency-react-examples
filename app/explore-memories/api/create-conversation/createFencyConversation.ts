import 'server-only'

import { z } from 'zod'

const createdConversationSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  createdAt: z.string().optional(),
})

export async function createFencyConversation(userId: string) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const response = await fetch('https://api.fency.ai/v1/conversations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metadata: { userId },
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to create conversation')
  }

  return createdConversationSchema.parse(await response.json())
}
