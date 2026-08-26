import 'server-only'

import { z } from 'zod'

const listAgentTasksSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        taskType: z.string().optional(),
      }),
    )
    .optional(),
})

export async function listFencyAgentTasks(conversationId: string) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const url = new URL('https://api.fency.ai/v1/agent-tasks')
  url.searchParams.set('conversationId', conversationId)
  url.searchParams.set('asc', 'true')
  url.searchParams.set('limit', '100')

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to list agent tasks')
  }

  return listAgentTasksSchema.parse(await response.json())
}
