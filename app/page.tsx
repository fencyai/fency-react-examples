'use client'

import { Anchor, Button, Card, Group, SimpleGrid, Text, Title } from '@mantine/core'
import Link from 'next/link'

const examples = [
  {
    href: '/streaming-response',
    title: 'Streaming response',
    description: 'One prompt. The reply streams in as it is generated.',
    guide: 'https://docs.fency.ai/docs/integration/streaming-response',
  },
  {
    href: '/json-response',
    title: 'JSON response',
    description:
      'One prompt. The reply is a JSON object with a string, a boolean, and a number.',
    guide: 'https://docs.fency.ai/docs/integration/json-response',
  },
  {
    href: '/basic-chat',
    title: 'Basic chat',
    description: 'A multi-turn chat. Each reply streams in.',
    guide: 'https://docs.fency.ai/docs/integration/basic-chat',
  },
  {
    href: '/json-extraction',
    title: 'JSON extraction',
    description: 'Paste free text and get a typed record back.',
    guide: 'https://docs.fency.ai/docs/integration/json-extraction',
  },
  {
    href: '/document-json-extraction',
    title: 'Document JSON extraction',
    description: 'Upload a PDF and pull typed fields out of it.',
    guide: 'https://docs.fency.ai/docs/integration/document-json-extraction',
  },
  {
    href: '/data-exploration',
    title: 'Data exploration',
    description: 'Ask questions over a per-user catalog.',
    guide: 'https://docs.fency.ai/docs/integration/data-exploration',
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <Title order={1} size="h2">
        Fency React examples
      </Title>
      <Text c="dimmed" mt="sm" maw={672}>
        Each card is a use case. Open it, then follow the matching guide while
        inspecting that folder.
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
