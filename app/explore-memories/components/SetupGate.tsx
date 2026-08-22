'use client'

import { Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { useSetup } from '../hooks/useSetup'
import { SetupPanel } from './SetupPanel'

export function SetupGate({ children }: { children: ReactNode }) {
  const { isChecking, isCreating, isReady, error, createCatalog } = useSetup()

  if (isChecking) {
    return (
      <Text size="sm" c="dimmed" p="md">
        Checking car catalog...
      </Text>
    )
  }

  if (!isReady) {
    return (
      <SetupPanel
        isCreating={isCreating}
        error={error}
        onCreateCatalog={() => void createCatalog()}
      />
    )
  }

  return children
}
