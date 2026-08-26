'use client'

import { useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import {
  extractionJsonSchema,
  extractionSchema,
  type Extraction,
} from '../extractionSchema'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'

async function fetchCreateAgentTaskClientToken() {
  const res = await fetch(
    '/structured-chat-completion/api/create-agent-task-session',
    { method: 'POST' },
  )
  if (!res.ok) {
    throw new Error('Failed to create agent task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useStructuredExtraction() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestResult, setLatestResult] = useState<Extraction | null>(null)

  const { latest, createAgentTask } = useAgentTasks({})

  async function extract(text: string) {
    setIsSubmitting(true)
    setLatestResult(null)

    try {
      const response = await createAgentTask(
        {
          type: 'StructuredChatCompletion',
          messages: [
            {
              role: 'SYSTEM',
              content:
                'Extract a single person record from the user text. Use empty strings for fields that are not mentioned.',
            },
            { role: 'USER', content: text },
          ],
          model: 'anthropic/claude-sonnet-4.6',
          jsonSchema: extractionJsonSchema,
        },
        { fetchCreateAgentTaskClientToken },
      )

      if (
        response.type === 'success' &&
        response.response.taskType === 'StructuredChatCompletion'
      ) {
        setLatestResult(
          extractionSchema.parse(
            JSON.parse(response.response.response.jsonResponse),
          ),
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    latestTask: latest,
    latestResult,
    isSubmitting,
    extract,
  }
}
