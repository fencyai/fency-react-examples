'use client'

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { Anchor, Button, Group } from '@mantine/core'
import Link from 'next/link'

export function AppHeader() {
  return (
    <header className="shrink-0 border-b border-(--border) bg-(--card)">
      <Group
        className="mx-auto max-w-5xl"
        px="md"
        py="sm"
        gap="md"
        wrap="wrap"
        justify="space-between"
      >
        <Group gap="md" wrap="wrap">
          <Anchor
            component={Link}
            href="/"
            fw={600}
            underline="never"
            c="inherit"
          >
            Fency examples
          </Anchor>
          <Anchor
            component={Link}
            href="/streaming-chat-completion"
            c="dimmed"
            underline="never"
          >
            Streaming chat
          </Anchor>
          <Anchor
            component={Link}
            href="/structured-chat-completion"
            c="dimmed"
            underline="never"
          >
            Structured chat
          </Anchor>
          <Anchor
            component={Link}
            href="/explore-memories"
            c="dimmed"
            underline="never"
          >
            Explore memories
          </Anchor>
          <Anchor
            component={Link}
            href="/document-analysis"
            c="dimmed"
            underline="never"
          >
            Document analysis
          </Anchor>
        </Group>
        <Group gap="sm">
          <Show when="signed-out">
            <SignInButton>
              <Button variant="default" size="xs">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="xs">Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Group>
      </Group>
    </header>
  )
}
