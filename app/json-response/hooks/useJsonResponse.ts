'use client'

import { useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import {
  responseJsonSchema,
  responseSchema,
  type JsonResponse,
} from '../responseSchema'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'

async function fetchCreateAgentTaskClientToken() {
  const res = await fetch('/json-response/api/create-agent-task-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create agent task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useJsonResponse() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestResult, setLatestResult] = useState<JsonResponse | null>(null)

  const { latest, createAgentTask } = useAgentTasks({})

  async function getJson(prompt: string) {
    setIsSubmitting(true)
    setLatestResult(null)

    try {
      const response = await createAgentTask(
        {
          type: 'StructuredChatCompletion',
          messages: [{ role: 'USER', content: prompt }],
          model: 'anthropic/claude-sonnet-4.6',
          jsonSchema: responseJsonSchema,
        },
        { fetchCreateAgentTaskClientToken },
      )

      if (response.type !== 'success') {
        throw new Error(response.error.message)
      }
      if (response.response.taskType !== 'StructuredChatCompletion') {
        throw new Error('Unexpected StructuredChatCompletion outcome.')
      }
      setLatestResult(
        responseSchema.parse(
          JSON.parse(response.response.response.jsonResponse),
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    latestTask: latest,
    latestResult,
    isSubmitting,
    getJson,
  }
}
