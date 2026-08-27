'use client'

import { CheckIcon, Group, Loader, Text, UnstyledButton } from '@mantine/core'
import type { DataPointSearchWithTask } from '../dataPointSearch'

function isSearching(search: DataPointSearchWithTask) {
  return !search.task || search.task.loading
}

function isDone(search: DataPointSearchWithTask) {
  return Boolean(search.task && !search.task.error && !search.task.loading)
}

export function DataPointSearchCard({
  search,
  onOpen,
}: {
  search: DataPointSearchWithTask
  onOpen: () => void
}) {
  const done = isDone(search)

  return (
    <UnstyledButton
      onClick={onOpen}
      w="100%"
      p="md"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-lg)',
        backgroundColor: done
          ? 'var(--mantine-color-green-0)'
          : undefined,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text size="sm">{search.label}</Text>
        {isSearching(search) ? (
          <Loader size="sm" />
        ) : done ? (
          <CheckIcon
            size={16}
            style={{ color: 'var(--mantine-color-green-6)' }}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Failed
          </Text>
        )}
      </Group>
    </UnstyledButton>
  )
}
