import { Badge, Button, Center, Loader, Stack, Text, Title } from '@mantine/core'
import type { Conversation } from '../hooks/useConversation'
import { ConversationNavItem } from './ConversationNavItem'

export function ConversationNavbar({
  conversations,
  selectedConversationId,
  isDraftNewChat,
  isLoadingList,
  onSelectConversation,
  onStartNewChat,
}: {
  conversations: Array<Conversation & { title: string }>
  selectedConversationId: string | null
  isDraftNewChat: boolean
  isLoadingList: boolean
  onSelectConversation: (conversationId: string) => void
  onStartNewChat: () => void
}) {
  return (
    <Stack gap="sm" h="100%" p="sm" style={{ overflow: 'hidden' }}>
      <div>
        <Badge size="sm" variant="light" color="red" mb={4}>
          Advanced
        </Badge>
        <Title order={1} size="h5">
          Data exploration
        </Title>
      </div>
      <Button onClick={onStartNewChat}>
        New chat
      </Button>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {isLoadingList ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
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
