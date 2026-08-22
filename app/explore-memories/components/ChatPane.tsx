'use client'

import { Alert, Stack, Text } from '@mantine/core'
import { AgentTaskProgress, useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import type { LatestTurn } from '../hooks/useConversation'
import { ChatComposer } from './ChatComposer'
import { UserQueryBubble } from './UserQueryBubble'

export function ChatPane({
  isDraftNewChat,
  isLoadingTurn,
  latestTurn,
  error,
  conversationReady,
  isCreatingConversation,
  onEnsureConversation,
  onFirstMessage,
}: {
  isDraftNewChat: boolean
  isLoadingTurn: boolean
  latestTurn: LatestTurn | null
  error: string | null
  conversationReady: boolean
  isCreatingConversation: boolean
  onEnsureConversation: () => Promise<{ id: string }>
  onFirstMessage: (conversationId: string, query: string) => void
}) {
  const [input, setInput] = useState('')
  const [liveQuery, setLiveQuery] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { latest, createAgentTask } = useAgentTasks({})

  const inputDisabled =
    isSubmitting ||
    isCreatingConversation ||
    isLoadingTurn ||
    (!isDraftNewChat && !conversationReady)

  const liveExploreTask =
    liveQuery && latest && latest.params.type === 'ExploreMemories'
      ? latest
      : null

  const displayedQuery = liveQuery ?? latestTurn?.query
  const displayedTask = liveExploreTask ?? latestTurn?.agentTask ?? null

  async function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || inputDisabled) {
      return
    }

    const hadHistory = latestTurn !== null
    setIsSubmitting(true)
    setLiveQuery(trimmed)
    setInput('')

    try {
      const current = await onEnsureConversation()
      if (!hadHistory) {
        onFirstMessage(current.id, trimmed)
      }

      const response = await createAgentTask(
        {
          type: 'ExploreMemories',
          query: trimmed,
          model: 'anthropic/claude-sonnet-4.6',
        },
        {
          fetchCreateAgentTaskClientToken: async () => {
            const res = await fetch('/explore-memories/api/agent-task-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                conversationId: current.id,
              }),
            })
            if (!res.ok) {
              throw new Error('Failed to create agent task session')
            }
            const data = (await res.json()) as { clientToken?: string }
            if (!data.clientToken) {
              throw new Error('No clientToken in session response')
            }
            return { clientToken: data.clientToken }
          },
        },
      )

      if (response.type === 'success' && !hadHistory) {
        onFirstMessage(current.id, trimmed)
      }
    } catch {
      // Task errors also surface on latest.error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack h="100%" gap={0}>
      <Stack
        gap="md"
        p="md"
        style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
      >
        {error ? <Alert color="red">{error}</Alert> : null}
        {isLoadingTurn ? (
          <Text size="sm" c="dimmed">
            Loading conversation...
          </Text>
        ) : displayedQuery ? (
          <>
            <UserQueryBubble query={displayedQuery} />
            {displayedTask ? (
              displayedTask.error ? (
                <Alert color="red">{displayedTask.error.message}</Alert>
              ) : (
                <AgentTaskProgress agentTask={displayedTask} />
              )
            ) : null}
          </>
        ) : (
          <Text size="sm" c="dimmed">
            Ask a question over your memories. Each chat is a Fency conversation
            scoped to your signed-in user.
          </Text>
        )}
      </Stack>
      <div
        style={{
          padding: 'var(--mantine-spacing-md)',
          borderTop: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <ChatComposer
          value={input}
          disabled={inputDisabled}
          isSubmitting={isSubmitting}
          onChange={setInput}
          onSubmit={() => void handleSubmit()}
        />
      </div>
    </Stack>
  )
}
