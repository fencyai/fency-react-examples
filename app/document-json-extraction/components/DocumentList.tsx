'use client'

import { Center, Loader, Stack, Text, Title } from '@mantine/core'
import type { AnalyzedDocument } from '../analyzedDocument'
import { DocumentListItem } from './DocumentListItem'

export function DocumentList({
  documents,
  isLoading,
  selectedId,
  onSelect,
}: {
  documents: AnalyzedDocument[]
  isLoading: boolean
  selectedId: string | null
  onSelect: (document: AnalyzedDocument) => void
}) {
  return (
    <Stack gap="xs">
      <Title order={2} size="h5">
        Documents
      </Title>
      {isLoading ? (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      ) : documents.length === 0 ? (
        <Text size="sm" c="dimmed">
          No documents yet.
        </Text>
      ) : (
        documents.map((document) => (
          <DocumentListItem
            key={document.id}
            document={document}
            active={document.id === selectedId}
            onSelect={() => onSelect(document)}
          />
        ))
      )}
    </Stack>
  )
}
