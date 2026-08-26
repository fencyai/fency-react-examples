'use client'

import { Alert, Center, Loader, Stack, Text } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import { useExploreChat } from '../hooks/useExploreChat'
import type { LatestTurn } from '../hooks/useConversation'
import { ChatComposer } from './ChatComposer'
import { UserQueryBubble } from './UserQueryBubble'

export function ChatPane({
  selectedConversationId,
  isDraftNewChat,
  isLoadingTurn,
  latestTurn,
  error,
  conversationReady,
  isCreatingConversation,
  onEnsureConversation,
  onFirstMessage,
}: {
  selectedConversationId: string | null
  isDraftNewChat: boolean
  isLoadingTurn: boolean
  latestTurn: LatestTurn | null
  error: string | null
  conversationReady: boolean
  isCreatingConversation: boolean
  onEnsureConversation: () => Promise<{ id: string }>
  onFirstMessage: (conversationId: string, query: string) => void
}) {
  const { isSubmitting, displayedQuery, displayedTask, sendQuery } =
    useExploreChat({
      selectedConversationId,
      latestTurn,
      onEnsureConversation,
      onFirstMessage,
    })

  const inputDisabled =
    isSubmitting ||
    isCreatingConversation ||
    isLoadingTurn ||
    (!isDraftNewChat && !conversationReady)

  return (
    <Stack h="100%" gap={0}>
      <Stack
        gap="md"
        p="md"
        style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
      >
        {error ? <Alert color="red">{error}</Alert> : null}
        {isLoadingTurn ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : displayedQuery ? (
          <>
            <UserQueryBubble query={displayedQuery} />
            {displayedTask?.error ? (
              <Alert color="red">{displayedTask.error.message}</Alert>
            ) : displayedTask ? (
              <AgentTaskProgress agentTask={displayedTask} />
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
          disabled={inputDisabled}
          isSubmitting={isSubmitting}
          onSend={sendQuery}
        />
      </div>
    </Stack>
  )
}
