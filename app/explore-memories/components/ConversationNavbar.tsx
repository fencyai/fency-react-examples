import { Button, Stack, Text, Title } from '@mantine/core'
import type { ExploreConversation } from '../hooks/useConversation'
import { ConversationNavItem } from './ConversationNavItem'

export function ConversationNavbar({
  conversations,
  selectedConversationId,
  isDraftNewChat,
  isLoadingList,
  onSelectConversation,
  onStartNewChat,
}: {
  conversations: Array<ExploreConversation & { title: string }>
  selectedConversationId: string | null
  isDraftNewChat: boolean
  isLoadingList: boolean
  onSelectConversation: (conversationId: string) => void
  onStartNewChat: () => void
}) {
  return (
    <Stack gap="sm" h="100%" p="sm" style={{ overflow: 'hidden' }}>
      <Title order={2} size="h6">
        Explore memories
      </Title>
      <Button variant="default" onClick={onStartNewChat}>
        New chat
      </Button>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {isLoadingList ? (
          <Text size="sm" c="dimmed" px="xs">
            Loading chats...
          </Text>
        ) : conversations.length === 0 ? (
          <Text size="sm" c="dimmed" px="xs">
            No chats yet.
          </Text>
        ) : (
          <Stack gap={4}>
            {conversations.map((conversation) => (
              <ConversationNavItem
                key={conversation.id}
                title={conversation.title}
                active={
                  !isDraftNewChat && selectedConversationId === conversation.id
                }
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </Stack>
        )}
      </div>
    </Stack>
  )
}
