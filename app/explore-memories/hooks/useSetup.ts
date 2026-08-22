'use client'

import { useCallback, useEffect, useState } from 'react'

export function useSetup() {
  const [isChecking, setIsChecking] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkSetup = useCallback(async () => {
    setIsChecking(true)
    setError(null)
    try {
      const res = await fetch('/explore-memories/api/setup', {
        cache: 'no-store',
      })
      if (!res.ok) {
        throw new Error('Failed to check catalog setup.')
      }
      const data = (await res.json()) as { ready?: boolean }
      setIsReady(Boolean(data.ready))
    } catch {
      setError('Failed to check catalog setup.')
      setIsReady(false)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    void checkSetup()
  }, [checkSetup])

  const createCatalog = useCallback(async () => {
    setIsCreating(true)
    setError(null)
    try {
      const res = await fetch('/explore-memories/api/setup', {
        method: 'POST',
      })
      const data = (await res.json().catch(() => ({}))) as {
        ready?: boolean
        error?: string
      }
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to create the car catalog.')
      }
      setIsReady(Boolean(data.ready))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create the car catalog.',
      )
      setIsReady(false)
    } finally {
      setIsCreating(false)
    }
  }, [])

  return {
    isChecking,
    isCreating,
    isReady,
    error,
    createCatalog,
  }
}
