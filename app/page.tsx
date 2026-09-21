'use client'

import { Anchor, Button, Card, Group, SimpleGrid, Text, Title } from '@mantine/core'
import Link from 'next/link'

const examples = [
  {
    href: '/streaming-chat-completion',
    title: 'Streaming chat completion',
    description: 'A chat that streams tokens as they are generated.',
    guide: 'https://docs.fency.ai/docs/integration/streaming-chat-completion',
  },
  {
    href: '/structured-chat-completion',
    title: 'Structured chat completion',
    description:
      'Paste free text and extract a JSON record shaped by a Zod schema.',
    guide: 'https://docs.fency.ai/docs/integration/structured-chat-completion',
  },
  {
    href: '/explore-memories',
    title: 'Explore memories',
    description:
      'A chat with per-user conversation threads that search a signed-in user’s memories.',
    guide: 'https://docs.fency.ai/docs/integration/explore-memories',
  },
  {
    href: '/document-analysis',
    title: 'Document analysis',
    description:
      'Upload a PDF, wait for the memory.updated webhook, then extract typed data points with MemorySearch.',
    guide: 'https://docs.fency.ai/docs/integration/document-analysis',
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
          <Card
            key={example.href}
            withBorder
            padding="lg"
            radius="md"
            className="flex h-full flex-col transition-shadow hover:shadow-sm"
          >
            <Title order={2} size="h4">
              {example.title}
            </Title>
            <Text size="sm" c="dimmed" mt="xs" mb="lg">
              {example.description}
            </Text>
            <Group gap="md" mt="auto">
              <Button component={Link} href={example.href} size="sm">
                Open example
              </Button>
              <Anchor
                href={example.guide}
                c="dimmed"
                size="sm"
                underline="hover"
              >
                Read the guide
              </Anchor>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  )
}
