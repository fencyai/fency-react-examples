'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'

const setupStatusSchema = z.object({
  ready: z.boolean(),
})

const setupResultSchema = z.object({
  ready: z.boolean().optional(),
  error: z.string().optional(),
})

export function useSetup() {
  const [isChecking, setIsChecking] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const res = await fetch('/explore-memories/api/get-setup-status', {
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error('Failed to check catalog setup.')
        }
        const { ready } = setupStatusSchema.parse(await res.json())
        if (!cancelled) {
          setIsReady(ready)
        }
      } catch {
        if (!cancelled) {
          setError('Failed to check catalog setup.')
          setIsReady(false)
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  async function createCatalog() {
    setIsCreating(true)
    setError(null)
    try {
      const res = await fetch('/explore-memories/api/create-car-catalog', {
        method: 'POST',
      })
      const data = setupResultSchema.parse(await res.json())
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
  }

  return {
    isChecking,
    isCreating,
    isReady,
    error,
    createCatalog,
  }
}
