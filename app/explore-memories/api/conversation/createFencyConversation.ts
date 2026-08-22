import 'server-only'

export async function createFencyConversation(body: Record<string, unknown>) {
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
    body: JSON.stringify(body),
  })
  const data = (await response.json()) as {
    id?: string
    title?: string | null
    createdAt?: string
    error?: unknown
  }
  return { ok: response.ok, status: response.status, data }
}
