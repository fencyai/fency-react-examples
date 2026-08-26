'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AgentTask } from '@fencyai/react'
import { z } from 'zod'

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

const conversationSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  createdAt: z.string().optional(),
})

const conversationsResponseSchema = z.object({
  conversations: z.array(conversationSchema),
})

const createConversationResponseSchema = z.object({
  conversation: conversationSchema,
})

const listAgentTasksResponseSchema = z.object({
  agentTasks: z.array(
    z.object({
      id: z.string(),
      taskType: z.string().optional(),
    }),
  ),
})

const agentTaskResponseSchema = z.object({
  turn: z.object({
    id: z.string(),
    query: z.string(),
    agentTask: z.custom<AgentTask>(),
  }),
})

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
      const listRes = await fetch(
        `/explore-memories/api/list-agent-tasks?conversationId=${encodeURIComponent(conversationId)}`,
      )
      if (!listRes.ok) {
        throw new Error('Failed to load conversation.')
      }
      const { agentTasks } = listAgentTasksResponseSchema.parse(
        await listRes.json(),
      )
      const latestTask = agentTasks
        .filter((task) => task.taskType === 'EXPLORE_MEMORIES')
        .at(-1)
      if (!latestTask) {
        setLatestTurn(null)
        return
      }

      const turnRes = await fetch(
        `/explore-memories/api/get-agent-task-response?agentTaskId=${encodeURIComponent(latestTask.id)}`,
      )
      if (!turnRes.ok) {
        throw new Error('Failed to load conversation.')
      }
      const { turn } = agentTaskResponseSchema.parse(await turnRes.json())
      setLatestTurn(turn)
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
      try {
        const res = await fetch('/explore-memories/api/list-conversations', {
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error('Failed to load conversations.')
        }
        const data = conversationsResponseSchema.parse(await res.json())
        if (cancelled) {
          return
        }
        const items = data.conversations
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
      const res = await fetch('/explore-memories/api/create-conversation', {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Failed to create conversation')
      }
      const data = createConversationResponseSchema.parse(await res.json())
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
