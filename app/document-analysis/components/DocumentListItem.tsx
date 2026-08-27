'use client'

import { CheckIcon, Group, Loader, Stack, Text, UnstyledButton } from '@mantine/core'
import type { AnalyzedDocument, ContentStatus } from '../analyzedDocument'

function statusLabel(status: ContentStatus) {
  switch (status) {
    case 'SYNCHRONIZED':
      return 'Ready'
    case 'SYNCHRONIZATION_ERROR':
      return 'Failed'
    case 'SYNCHRONIZING':
      return 'Indexing'
    case 'EMPTY':
      return 'Waiting for webhook'
  }
}

export function DocumentListItem({
  document,
  active,
  onSelect,
}: {
  document: AnalyzedDocument
  active: boolean
  onSelect: () => void
}) {
  const ready = document.contentStatus === 'SYNCHRONIZED'
  const pending =
    document.contentStatus === 'EMPTY' ||
    document.contentStatus === 'SYNCHRONIZING'

  return (
    <UnstyledButton
      onClick={onSelect}
      w="100%"
      p="md"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-lg)',
        backgroundColor: ready
          ? 'var(--mantine-color-green-0)'
          : undefined,
        outline: active
          ? ready
            ? '2px solid var(--mantine-color-green-3)'
            : '2px solid var(--mantine-color-dimmed)'
          : undefined,
        outlineOffset: active ? '-1px' : undefined,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Text size="sm">{document.fileName}</Text>
          <Text size="sm" c="dimmed">
            {statusLabel(document.contentStatus)}
          </Text>
        </Stack>
        {pending ? (
          <Loader size="sm" />
        ) : ready ? (
          <CheckIcon
            size={16}
            style={{ color: 'var(--mantine-color-green-6)' }}
          />
        ) : null}
      </Group>
    </UnstyledButton>
  )
}
