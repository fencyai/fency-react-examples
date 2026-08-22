import 'server-only'

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return {}
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { raw: text }
  }
}

export async function fetchFencyAgentTaskArchive(
  agentTaskId: string,
  origin: string,
) {
  const secretKey = process.env.FENCY_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }
  if (!publishableKey) {
    throw new Error('NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY is not defined.')
  }

  const sessionResponse = await fetch('https://api.fency.ai/v1/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      getAgentTaskResponse: { agentTaskId },
    }),
  })
  const sessionData = (await readJson(sessionResponse)) as {
    clientToken?: string
    error?: unknown
  }
  if (!sessionResponse.ok || typeof sessionData.clientToken !== 'string') {
    throw new Error(
      `Fency session for agent task response failed: ${sessionResponse.status}`,
    )
  }

  const linkResponse = await fetch(
    'https://api.fency.ai/pub/ct/agent-task-response/download-link',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        'X-Fency-Publishable-Key': publishableKey,
        'X-Fency-Client-Token': sessionData.clientToken,
      },
      body: JSON.stringify({ agentTaskId }),
    },
  )
  const linkData = (await linkResponse.json()) as {
    downloadLink?: string
    query?: string | null
    error?: unknown
  }
  if (!linkResponse.ok || typeof linkData.downloadLink !== 'string') {
    throw new Error(
      `Fency agent task response download-link failed: ${linkResponse.status}`,
    )
  }

  const archiveResponse = await fetch(linkData.downloadLink)
  if (!archiveResponse.ok) {
    throw new Error(
      `Failed to download agent task archive: ${archiveResponse.status}`,
    )
  }

  return {
    query: linkData.query ?? null,
    archive: await readJson(archiveResponse),
  }
}
