import 'server-only'

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
  const data = (await response.json()) as {
    id?: string
    metadata?: { userId?: unknown }
    error?: unknown
  }
  return { ok: response.ok, status: response.status, data }
}
