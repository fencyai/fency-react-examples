import 'server-only'

import { z } from 'zod'

const fencyAgentTaskSchema = z.object({
  id: z.string(),
  metadata: z.object({
    userId: z.string(),
  }),
})

export async function getFencyAgentTask(agentTaskId: string) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const response = await fetch(
    `https://api.fency.ai/v1/agent-tasks/${encodeURIComponent(agentTaskId)}`,
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
    data: fencyAgentTaskSchema.parse(await response.json()),
  }
}
