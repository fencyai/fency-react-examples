'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AgentTask } from '@fencyai/react'

export type ExploreConversation = {
  id: string
  title: string | null
  createdAt?: string
}

export type LatestTurn = {
  id: string
  query: string
  agentTask: AgentTask
}

function conversationListTitle(item: ExploreConversation) {
  const title = item.title?.trim()
  if (title) {
    return title
  }
  if (item.createdAt) {
    const date = new Date(item.createdAt)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    }
  }
  return 'New chat'
}

export function useConversation() {
  const [conversations, setConversations] = useState<ExploreConversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [isDraftNewChat, setIsDraftNewChat] = useState(true)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingTurn, setIsLoadingTurn] = useState(false)
  const [latestTurn, setLatestTurn] = useState<LatestTurn | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>(
    {},
  )
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const selectedRef = useRef(selectedConversationId)

  useEffect(() => {
    selectedRef.current = selectedConversationId
  }, [selectedConversationId])

  const loadLatestTurn = useCallback(async (conversationId: string) => {
    setIsLoadingTurn(true)
    setError(null)
    try {
      const res = await fetch(
        `/explore-memories/api/latest-turn?conversationId=${encodeURIComponent(conversationId)}`,
      )
      if (!res.ok) {
        throw new Error('Failed to load conversation.')
      }
      const data = (await res.json()) as { latestTurn?: LatestTurn | null }
      setLatestTurn(data.latestTurn ?? null)
    } catch {
      setLatestTurn(null)
      setError('Failed to load conversation.')
    } finally {
      setIsLoadingTurn(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setIsLoadingList(true)
      setError(null)
      try {
        const res = await fetch('/explore-memories/api/conversation', {
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error('Failed to load conversations.')
        }
        const data = (await res.json()) as {
          conversations?: ExploreConversation[]
        }
        if (cancelled) {
          return
        }
        const items = Array.isArray(data.conversations)
          ? data.conversations
          : []
        setConversations(items)
        setIsLoadingList(false)
        if (items[0]) {
          setSelectedConversationId(items[0].id)
          setIsDraftNewChat(false)
          await loadLatestTurn(items[0].id)
        } else {
          setSelectedConversationId(null)
          setIsDraftNewChat(true)
          setLatestTurn(null)
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load conversations.')
          setIsDraftNewChat(true)
          setIsLoadingList(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [loadLatestTurn])

  const selectConversation = useCallback(
    (conversationId: string) => {
      setSelectedConversationId(conversationId)
      setIsDraftNewChat(false)
      setLatestTurn(null)
      void loadLatestTurn(conversationId)
    },
    [loadLatestTurn],
  )

  const startNewChat = useCallback(() => {
    setSelectedConversationId(null)
    setIsDraftNewChat(true)
    setLatestTurn(null)
    setError(null)
  }, [])

  const ensureConversation = useCallback(async () => {
    if (selectedRef.current && !isDraftNewChat) {
      return { id: selectedRef.current }
    }

    setIsCreatingConversation(true)
    try {
      const res = await fetch('/explore-memories/api/conversation', {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Failed to create conversation')
      }
      const data = (await res.json()) as { conversation: ExploreConversation }
      setConversations((prev) => [data.conversation, ...prev])
      setSelectedConversationId(data.conversation.id)
      selectedRef.current = data.conversation.id
      setIsDraftNewChat(false)
      setLatestTurn(null)
      return data.conversation
    } finally {
      setIsCreatingConversation(false)
    }
  }, [isDraftNewChat])

  const setConversationTitle = useCallback(
    (conversationId: string, query: string) => {
      const title = query.trim()
      if (!title) {
        return
      }
      setTitleOverrides((prev) => ({ ...prev, [conversationId]: title }))
    },
    [],
  )

  const listedConversations: Array<ExploreConversation & { title: string }> =
    conversations.map((item) => ({
      ...item,
      title: titleOverrides[item.id] ?? conversationListTitle(item),
    }))

  return {
    conversations: listedConversations,
    selectedConversationId,
    isDraftNewChat,
    isLoadingList,
    isLoadingTurn,
    isCreatingConversation,
    latestTurn,
    error,
    selectConversation,
    startNewChat,
    ensureConversation,
    setConversationTitle,
  }
}
