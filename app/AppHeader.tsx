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
  { value: '/streaming-response', label: 'Streaming response' },
  { value: '/json-response', label: 'JSON response' },
  { value: '/basic-chat', label: 'Basic chat' },
  { value: '/json-extraction', label: 'JSON extraction' },
  { value: '/document-json-extraction', label: 'Document JSON extraction' },
  { value: '/data-exploration', label: 'Data exploration' },
] as const

function pickerValueFromPath(pathname: string) {
  return (
    examples.find(
      (example) =>
        pathname === example.value || pathname.startsWith(`${example.value}/`),
    )?.value ?? '/'
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const selected = pickerValueFromPath(pathname)

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
        <Select
          aria-label="Example"
          size="sm"
          w={260}
          data={[{ value: '/', label: 'Home' }, ...examples]}
          value={selected}
          allowDeselect={false}
          onChange={(href) => {
            if (href) {
              router.push(href)
            }
          }}
        />
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
