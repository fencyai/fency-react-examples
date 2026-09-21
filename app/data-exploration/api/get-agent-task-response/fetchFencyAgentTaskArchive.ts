import 'server-only'

import { z } from 'zod'
import { sessionClientTokenSchema } from '../../sessionClientTokenSchema'

const downloadLinkSchema = z.object({
  downloadLink: z.string(),
  query: z.string().nullable().optional(),
})

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
  if (!sessionResponse.ok) {
    throw new Error(
      `Fency session for agent task response failed: ${sessionResponse.status}`,
    )
  }
  const { clientToken } = sessionClientTokenSchema.parse(
    await sessionResponse.json(),
  )

  const linkResponse = await fetch(
    'https://api.fency.ai/pub/ct/agent-task-response/download-link',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        'X-Fency-Publishable-Key': publishableKey,
        'X-Fency-Client-Token': clientToken,
      },
      body: JSON.stringify({ agentTaskId }),
    },
  )
  if (!linkResponse.ok) {
    throw new Error(
      `Fency agent task response download-link failed: ${linkResponse.status}`,
    )
  }
  const linkData = downloadLinkSchema.parse(await linkResponse.json())

  const archiveResponse = await fetch(linkData.downloadLink)
  if (!archiveResponse.ok) {
    throw new Error(
      `Failed to download agent task archive: ${archiveResponse.status}`,
    )
  }

  return {
    query: linkData.query ?? null,
    archive: await archiveResponse.json(),
  }
}
