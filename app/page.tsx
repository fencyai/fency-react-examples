'use client'

import { Anchor, Card, Group, SimpleGrid, Text, Title } from '@mantine/core'
import Link from 'next/link'

const examples = [
  {
    href: '/streaming-chat-completion',
    title: 'Streaming chat completion',
    description: 'A chat that streams tokens as they are generated.',
    guide: 'https://fency.ai/docs/integration/streaming-chat-completion',
  },
  {
    href: '/structured-chat-completion',
    title: 'Structured chat completion',
    description:
      'Paste free text and extract a JSON record shaped by a Zod schema.',
    guide: 'https://fency.ai/docs/integration/structured-chat-completion',
  },
  {
    href: '/explore-memories',
    title: 'Explore memories',
    description:
      'A chat with per-user conversation threads. Each EXPLORE_MEMORIES task is attached after getConversation confirms ownership.',
    guide: 'https://fency.ai/docs/integration/explore-memories',
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <Title order={1} size="h2">
        Fency React examples
      </Title>
      <Text c="dimmed" mt="sm" maw={672}>
        Each example is a self-contained folder that maps 1-to-1 to a guide.
        Open the example, then follow the matching guide while inspecting that
        folder.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="xl">
        {examples.map((example) => (
          <Card key={example.href} withBorder padding="lg" radius="lg">
            <Title order={2} size="h4">
              {example.title}
            </Title>
            <Text size="sm" c="dimmed" mt="sm">
              {example.description}
            </Text>
            <Group gap="md" mt="md">
              <Anchor component={Link} href={example.href} underline="always">
                Open example
              </Anchor>
              <Anchor href={example.guide} c="dimmed" underline="always">
                Read the guide
              </Anchor>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  )
}
