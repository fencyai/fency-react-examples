'use client'

import { NavLink } from '@mantine/core'
import type { AnalyzedDocument } from '../analyzedDocument'

function statusLabel(status: string) {
  switch (status) {
    case 'SYNCHRONIZED':
      return 'Ready'
    case 'SYNCHRONIZATION_ERROR':
      return 'Failed'
    case 'SYNCHRONIZING':
      return 'Indexing'
    default:
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
  return (
    <NavLink
      label={document.fileName}
      description={statusLabel(document.contentStatus)}
      active={active}
      onClick={onSelect}
    />
  )
}
