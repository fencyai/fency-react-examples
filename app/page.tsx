'use client'

import { Anchor, Button, Card, Group, SimpleGrid, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { DifficultyBadge } from './DifficultyBadge'
import { examplesCatalog } from './examplesCatalog'

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
        {examplesCatalog.map((example) => (
          <Card
            key={example.href}
            withBorder
            padding="lg"
            radius="md"
            className="flex h-full flex-col transition-shadow hover:shadow-sm"
          >
            <DifficultyBadge level={example.difficulty} />
            <Title order={2} size="h4" mt="xs">
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
