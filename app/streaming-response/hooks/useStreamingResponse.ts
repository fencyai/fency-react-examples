'use client'

import { useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'

async function fetchCreateAgentTaskClientToken() {
  const res = await fetch('/streaming-response/api/create-agent-task-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create agent task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useStreamingResponse() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { latest, createAgentTask } = useAgentTasks({})

  async function generate(prompt: string) {
    setIsSubmitting(true)
    try {
      const response = await createAgentTask(
        {
          type: 'StreamingChatCompletion',
          messages: [{ role: 'USER', content: prompt }],
          model: 'anthropic/claude-sonnet-4.6',
        },
        { fetchCreateAgentTaskClientToken },
      )

      if (response.type !== 'success') {
        throw new Error(response.error.message)
      }
      if (response.response.taskType !== 'StreamingChatCompletion') {
        throw new Error('Unexpected StreamingChatCompletion outcome.')
      }
      const assistant = response.response.response.messages.at(-1)
      if (assistant?.role !== 'ASSISTANT') {
        throw new Error('StreamingChatCompletion did not return an assistant message.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    latestTask: latest,
    isSubmitting,
    generate,
  }
}
