'use client'

import { AgentTaskProgress, useAgentTasks } from '@fencyai/react'
import { useEffect, useRef, useState } from 'react'
import type { ExploreConversation, ExploreQuery } from './db/schema'

export function Explorer({
  initialConversation,
  initialQueries,
}: {
  initialConversation: ExploreConversation | null
  initialQueries: ExploreQuery[]
}) {
  const [conversation, setConversation] = useState(initialConversation)
  const [queries, setQueries] = useState(initialQueries)
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const conversationRef = useRef(conversation)

  const { latest, createAgentTask } = useAgentTasks({})

  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])

  async function ensureConversation() {
    if (conversationRef.current) {
      return conversationRef.current
    }
    const res = await fetch('/explore-memories/api/conversation', {
      method: 'POST',
    })
    if (!res.ok) {
      throw new Error('Failed to create conversation')
    }
    const data = (await res.json()) as { conversation: ExploreConversation }
    setConversation(data.conversation)
    conversationRef.current = data.conversation
    return data.conversation
  }

  async function handleNewConversation() {
    const res = await fetch('/explore-memories/api/conversation', {
      method: 'POST',
    })
    if (!res.ok) {
      throw new Error('Failed to create conversation')
    }
    const data = (await res.json()) as { conversation: ExploreConversation }
    setConversation(data.conversation)
    conversationRef.current = data.conversation
    setQueries([])
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const current = await ensureConversation()
      const response = await createAgentTask(
        {
          type: 'ExploreMemories',
          query: trimmed,
          model: 'anthropic/claude-sonnet-4.6',
        },
        {
          fetchCreateAgentTaskClientToken: async () => {
            const res = await fetch('/explore-memories/api/agent-task-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId: current.fencyConversationId,
              }),
            })
            if (!res.ok) {
              throw new Error('Failed to create agent task session')
            }
            const data = (await res.json()) as { clientToken?: string }
            if (!data.clientToken) {
              throw new Error('No clientToken in session response')
            }
            return { clientToken: data.clientToken }
          },
        },
      )

      if (response.type !== 'success') {
        return
      }

      const persistRes = await fetch('/explore-memories/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: current.id,
          query: trimmed,
          fencyAgentTaskId: response.agentTaskId,
        }),
      })
      const persistData = (await persistRes.json()) as { query: ExploreQuery }
      setQueries((currentQueries) => [persistData.query, ...currentQueries])
      setInput('')
    } catch {
      // Task errors also surface on latest.error
    } finally {
      setIsSubmitting(false)
    }
  }

  const liveExploreTask =
    isSubmitting && latest && latest.params.type === 'ExploreMemories'
      ? latest
      : null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-semibold">Explore memories</h1>
          <p className="text-sm text-(--muted)">
            Creates a Fency conversation, then attaches each EXPLORE_MEMORIES
            task to that conversationId. Guard rails are omitted on purpose for
            now.
          </p>
          {conversation ? (
            <p className="mt-2 font-mono text-xs text-(--muted)">
              {conversation.fencyConversationId}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleNewConversation}
          className="shrink-0 rounded border border-(--border) px-3 py-1.5 text-sm"
        >
          New conversation
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={4}
          disabled={isSubmitting}
          placeholder="Ask a question over your memories..."
          className="w-full rounded border border-(--border) bg-(--card) px-3 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="self-start rounded border border-(--border) px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Exploring...' : 'Explore'}
        </button>
      </form>

      {liveExploreTask ? (
        <div>
          {liveExploreTask.error ? (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {liveExploreTask.error.message}
            </div>
          ) : (
            <AgentTaskProgress agentTask={liveExploreTask} />
          )}
        </div>
      ) : null}

      <section>
        <h2 className="mb-2 text-sm font-semibold">Previous queries</h2>
        {queries.length === 0 ? (
          <p className="text-sm text-(--muted)">
            Nothing stored yet. Run a query and reload - the conversation id
            and query list stay in Postgres.
          </p>
        ) : (
          <ul className="divide-y divide-(--border) rounded border border-(--border)">
            {queries.map((item) => (
              <li key={item.id} className="px-3 py-2 text-sm">
                <p>{item.query}</p>
                {item.fencyAgentTaskId ? (
                  <p className="mt-1 font-mono text-xs text-(--muted)">
                    {item.fencyAgentTaskId}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
