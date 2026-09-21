import { Paper, Text } from '@mantine/core'
import type { ChatMessage } from '../ChatMessage'

export function Bubble({ message }: { message: ChatMessage }) {
  if (message.role !== 'USER') {
    throw new Error('Bubble only renders USER messages.')
  }

  return (
    <Paper
      radius="md"
      px="md"
      py="sm"
      maw="75%"
      bg="blue.6"
      c="white"
      style={{
        marginLeft: 'auto',
        width: 'fit-content',
      }}
    >
      <Text size="sm" c="inherit">
        {message.content}
      </Text>
    </Paper>
  )
}
