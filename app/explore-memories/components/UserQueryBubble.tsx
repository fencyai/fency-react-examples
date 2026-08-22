import { Paper, Text } from '@mantine/core'

export function UserQueryBubble({ query }: { query: string }) {
  return (
    <Paper
      radius="md"
      px="sm"
      py="xs"
      mb="sm"
      maw="80%"
      bg="blue.6"
      c="white"
      style={{ marginLeft: 'auto', width: 'fit-content' }}
    >
      <Text size="sm" c="inherit">
        {query}
      </Text>
    </Paper>
  )
}
