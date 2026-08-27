'use client'

import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import {
  analyzedDocumentSchema,
  type AnalyzedDocument,
  type ContentStatus,
} from '../analyzedDocument'

const listDocumentsSchema = z.object({
  documents: z.array(analyzedDocumentSchema),
})

function isPending(status: ContentStatus) {
  return status === 'EMPTY' || status === 'SYNCHRONIZING'
}

export function useDocuments() {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pendingIdsRef = useRef<Set<string>>(new Set())

  function upsertDocument(next: AnalyzedDocument) {
    setDocuments((current) => {
      const index = current.findIndex((document) => document.id === next.id)
      if (index === -1) {
        return [next, ...current]
      }
      const copy = [...current]
      copy[index] = next
      return copy
    })
  }

  async function refreshDocument(documentId: string) {
    const res = await fetch(
      `/document-analysis/api/get-document-status?documentId=${documentId}`,
      { cache: 'no-store' },
    )
    if (!res.ok) {
      throw new Error('Failed to load document status.')
    }
    const document = analyzedDocumentSchema.parse(await res.json())
    upsertDocument(document)
    if (!isPending(document.contentStatus)) {
      pendingIdsRef.current.delete(documentId)
    }
    return document
  }

  const refreshDocumentRef = useRef(refreshDocument)

  useEffect(() => {
    refreshDocumentRef.current = refreshDocument
  })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const res = await fetch('/document-analysis/api/list-documents', {
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error('Failed to list documents.')
        }
        const { documents: listed } = listDocumentsSchema.parse(
          await res.json(),
        )
        if (cancelled) {
          return
        }
        setDocuments(listed)
        for (const document of listed) {
          if (isPending(document.contentStatus)) {
            pendingIdsRef.current.add(document.id)
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to list documents.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      for (const documentId of pendingIdsRef.current) {
        void refreshDocumentRef.current(documentId).catch((err) => {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load document status.',
          )
        })
      }
    }, 2000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  function registerUploaded(document: AnalyzedDocument) {
    setError(null)
    upsertDocument(document)
    pendingIdsRef.current.add(document.id)
  }

  return {
    documents,
    isLoading,
    error,
    setError,
    registerUploaded,
  }
}
