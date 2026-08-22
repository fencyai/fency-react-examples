import 'server-only'

export async function listFencyAgentTasks(
  conversationId: string,
  options?: { asc?: boolean; limit?: number },
) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const url = new URL('https://api.fency.ai/v1/agent-tasks')
  url.searchParams.set('conversationId', conversationId)
  if (options?.asc !== undefined) {
    url.searchParams.set('asc', String(options.asc))
  }
  if (options?.limit !== undefined) {
    url.searchParams.set('limit', String(options.limit))
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })
  const data = (await response.json()) as {
    items?: Array<{
      id: string
      status?: string
      taskType?: string
      createdAt?: string
    }>
    error?: unknown
  }
  return { ok: response.ok, status: response.status, data }
}
