'use client'

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import {
  Button,
  Combobox,
  Group,
  InputBase,
  Text,
  useCombobox,
} from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { DifficultyBadge } from './DifficultyBadge'
import { examplesCatalog } from './examplesCatalog'

function pickerValueFromPath(pathname: string) {
  return (
    examplesCatalog.find(
      (example) =>
        pathname === example.href || pathname.startsWith(`${example.href}/`),
    )?.href ?? '/'
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const selected = pickerValueFromPath(pathname)
  const selectedExample = examplesCatalog.find(
    (example) => example.href === selected,
  )
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

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
        <Combobox
          store={combobox}
          onOptionSubmit={(href) => {
            router.push(href)
            combobox.closeDropdown()
          }}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              size="sm"
              w={320}
              aria-label="Example"
              rightSection={<Combobox.Chevron />}
              rightSectionPointerEvents="none"
              onClick={() => combobox.toggleDropdown()}
            >
              <Group gap="xs" wrap="nowrap" justify="space-between">
                <Text size="sm" truncate>
                  {selectedExample?.title ?? 'Home'}
                </Text>
                {selectedExample ? (
                  <DifficultyBadge level={selectedExample.difficulty} size="xs" />
                ) : null}
              </Group>
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              <Combobox.Option value="/">Home</Combobox.Option>
              {examplesCatalog.map((example) => (
                <Combobox.Option key={example.href} value={example.href}>
                  <Group gap="xs" wrap="nowrap" justify="space-between">
                    <Text size="sm">{example.title}</Text>
                    <DifficultyBadge level={example.difficulty} size="xs" />
                  </Group>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
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
