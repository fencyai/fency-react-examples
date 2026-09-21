'use client'

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { Button, Group, Select } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'

const examples = [
  { value: '/streaming-chat-completion', label: 'Streaming chat' },
  { value: '/structured-chat-completion', label: 'Structured chat' },
  { value: '/explore-memories', label: 'Explore memories' },
  { value: '/document-analysis', label: 'Document analysis' },
] as const

function exampleValueFromPath(pathname: string) {
  return (
    examples.find(
      (example) =>
        pathname === example.value || pathname.startsWith(`${example.value}/`),
    )?.value ?? null
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const selectedExample = exampleValueFromPath(pathname)

  return (
    <header className="shrink-0 border-b border-(--border) bg-(--card)">
      <Group
        className="mx-auto max-w-5xl"
        px="md"
        py="sm"
        gap="md"
        wrap="wrap"
        justify={selectedExample ? 'space-between' : 'flex-end'}
      >
        {selectedExample ? (
          <Select
            aria-label="Example"
            size="sm"
            w={200}
            data={examples}
            value={selectedExample}
            allowDeselect={false}
            onChange={(href) => {
              if (href) {
                router.push(href)
              }
            }}
          />
        ) : null}
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
