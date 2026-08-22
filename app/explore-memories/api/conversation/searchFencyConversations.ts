import 'server-only'

export type FencyConversationItem = {
  id: string
  title?: string | null
  createdAt?: string
}

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
  const data = (await response.json()) as {
    items?: FencyConversationItem[]
    error?: unknown
  }
  return { ok: response.ok, status: response.status, data }
}
