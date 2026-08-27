'use client'

import { Group, Text, UnstyledButton } from '@mantine/core'
import type { DataPointSearchWithTask } from '../dataPointSearch'

function statusLabel(search: DataPointSearchWithTask) {
  if (!search.task) {
    return 'Starting'
  }
  if (search.task.error) {
    return 'Failed'
  }
  if (search.task.loading) {
    return 'Searching'
  }
  return 'Done'
}

export function DataPointSearchCard({
  search,
  onOpen,
}: {
  search: DataPointSearchWithTask
  onOpen: () => void
}) {
  return (
    <UnstyledButton
      onClick={onOpen}
      w="100%"
      p="md"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-lg)',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text size="sm">{search.label}</Text>
        <Text size="sm" c="dimmed">
          {statusLabel(search)}
        </Text>
      </Group>
    </UnstyledButton>
  )
}
