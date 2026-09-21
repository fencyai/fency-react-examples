'use client'

import { Center, Loader } from '@mantine/core'
import type { ReactNode } from 'react'
import { useSetup } from '../hooks/useSetup'
import { SetupPanel } from './SetupPanel'

export function SetupGate({ children }: { children: ReactNode }) {
  const { isChecking, isCreating, isReady, error, createCatalog } = useSetup()

  if (isChecking) {
    return (
      <Center p="md" h="100%">
        <Loader size="sm" />
      </Center>
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
