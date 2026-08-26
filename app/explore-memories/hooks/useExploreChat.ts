'use client'

import { useAgentTasks } from '@fencyai/react'
import { useEffect, useRef, useState } from 'react'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'
import type { LatestTurn } from './useConversation'

async function fetchCreateAgentTaskClientToken(conversationId: string) {
  const res = await fetch('/explore-memories/api/create-agent-task-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversationId }),
  })
  if (!res.ok) {
    throw new Error('Failed to create agent task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useExploreChat({
  selectedConversationId,
  latestTurn,
  onEnsureConversation,
  onFirstMessage,
}: {
  selectedConversationId: string | null
  latestTurn: LatestTurn | null
  onEnsureConversation: () => Promise<{ id: string }>
  onFirstMessage: (conversationId: string, query: string) => void
}) {
  const [liveQuery, setLiveQuery] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { latest, createAgentTask } = useAgentTasks({})
  const previousConversationId = useRef(selectedConversationId)

  useEffect(() => {
    const previousId = previousConversationId.current
    previousConversationId.current = selectedConversationId
    if (previousId !== null && previousId !== selectedConversationId) {
      setLiveQuery(null)
    }
  }, [selectedConversationId])

  const liveExploreTask =
    liveQuery && latest && latest.params.type === 'ExploreMemories'
      ? latest
      : null

  async function sendQuery(text: string) {
    const hadHistory = latestTurn !== null
    setIsSubmitting(true)
    setLiveQuery(text)

    try {
      const current = await onEnsureConversation()
      if (!hadHistory) {
        onFirstMessage(current.id, text)
      }

      const response = await createAgentTask(
        {
          type: 'ExploreMemories',
          query: text,
          model: 'anthropic/claude-sonnet-4.6',
        },
        {
          fetchCreateAgentTaskClientToken: () =>
            fetchCreateAgentTaskClientToken(current.id),
        },
      )

      if (response.type === 'success' && !hadHistory) {
        onFirstMessage(current.id, text)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    displayedQuery: liveQuery ?? latestTurn?.query,
    displayedTask: liveExploreTask ?? latestTurn?.agentTask ?? null,
    sendQuery,
  }
}
