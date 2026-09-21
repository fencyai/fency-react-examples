'use client'

import { Modal, Text } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import type { DataPointSearchWithTask } from '../dataPointSearch'

export function DataPointSearchProgressModal({
  search,
  onClose,
}: {
  search: DataPointSearchWithTask | null
  onClose: () => void
}) {
  return (
    <Modal opened={search !== null} onClose={onClose} title={search?.label}>
      {search?.task ? (
        <AgentTaskProgress agentTask={search.task} />
      ) : (
        <Text size="sm" c="dimmed">
          Waiting for the search task.
        </Text>
      )}
    </Modal>
  )
}
