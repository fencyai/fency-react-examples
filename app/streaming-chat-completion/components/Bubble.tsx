import { Paper, Text } from '@mantine/core'
import type { ChatMessage } from '../ChatMessage'

export function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === 'SYSTEM') {
    return null
  }
  const isUser = message.role === 'USER'
  return (
    <Paper
      radius="md"
      px="sm"
      py="xs"
      mb={isUser ? 8 : 16}
      maw="80%"
      bg={isUser ? 'blue.6' : 'var(--card)'}
      c={isUser ? 'white' : undefined}
      style={{
        marginLeft: isUser ? 'auto' : undefined,
        marginRight: isUser ? undefined : 'auto',
        width: isUser ? 'fit-content' : undefined,
        whiteSpace: isUser ? undefined : 'pre-wrap',
      }}
    >
      <Text size="sm" c="inherit">
        {message.content}
      </Text>
    </Paper>
  )
}
