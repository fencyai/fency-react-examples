'use client'

import { useAgentTasks } from '@fencyai/react'
import { AgentTaskProgress } from '@fencyai/react'
import { useEffect, useRef, useState } from 'react'
import type {
  StreamingConversation,
  StreamingMessage,
} from './db/schema'

type ChatMessage = {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
}

export function Chat({
  initialConversation,
  initialMessages,
}: {
  initialConversation: StreamingConversation | null
  initialMessages: StreamingMessage[]
}) {
  const [conversation, setConversation] = useState(initialConversation)
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.map((message) => ({
      role: message.role as ChatMessage['role'],
      content: message.content,
    })),
  )
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const conversationRef = useRef(conversation)

  const { latest, createAgentTask } = useAgentTasks({})

  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, latest, isSubmitting])

  async function ensureConversation() {
    if (conversationRef.current) {
      return conversationRef.current
    }
    const res = await fetch('/streaming-chat-completion/api/conversation', {
      method: 'POST',
    })
    if (!res.ok) {
      throw new Error('Failed to create conversation')
    }
    const data = (await res.json()) as { conversation: StreamingConversation }
    setConversation(data.conversation)
    conversationRef.current = data.conversation
    return data.conversation
  }

  async function handleNewChat() {
    const res = await fetch('/streaming-chat-completion/api/conversation', {
      method: 'POST',
    })
    if (!res.ok) {
      throw new Error('Failed to create conversation')
    }
    const data = (await res.json()) as { conversation: StreamingConversation }
    setConversation(data.conversation)
    conversationRef.current = data.conversation
    setMessages([])
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'USER', content: trimmed },
    ]

    try {
      const current = await ensureConversation()
      const response = await createAgentTask(
        {
          type: 'StreamingChatCompletion',
          messages: nextMessages,
          model: 'anthropic/claude-sonnet-4.6',
        },
        {
          fetchCreateAgentTaskClientToken: async () => {
            const res = await fetch(
              '/streaming-chat-completion/api/agent-task-session',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  conversationId: current.fencyConversationId,
                }),
              },
            )
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

      if (
        response.type !== 'success' ||
        response.response.taskType !== 'StreamingChatCompletion'
      ) {
        return
      }

      const assistant = response.response.response.messages.at(-1)
      const persisted: ChatMessage[] = [
        ...nextMessages,
        ...(assistant?.role === 'ASSISTANT'
          ? [{ role: 'ASSISTANT' as const, content: assistant.content }]
          : []),
      ]

      await fetch('/streaming-chat-completion/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: current.id,
          fencyAgentTaskId: response.agentTaskId,
          messages: persisted.slice(messages.length),
        }),
      })

      setMessages(persisted)
    } catch {
      // Task errors also surface on latest.error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!input.trim() || isSubmitting) {
      return
    }
    const text = input
    setInput('')
    await sendMessage(text)
  }

  const liveStreamingTask =
    isSubmitting && latest && latest.params.type === 'StreamingChatCompletion'
      ? latest
      : null
  const liveUserContent =
    liveStreamingTask && liveStreamingTask.params.type === 'StreamingChatCompletion'
      ? (liveStreamingTask.params.messages.at(-1)?.content ?? '')
      : ''

  return (
    <div className="mx-auto flex h-[calc(100vh-3.25rem)] w-full max-w-3xl flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <h1 className="font-semibold">Streaming chat completion</h1>
          <p className="text-sm text-(--muted)">
            Tokens stream in as they are generated. Reload the page and the
            transcript comes back from Postgres.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNewChat}
          className="shrink-0 rounded border border-(--border) px-3 py-1.5 text-sm"
        >
          New chat
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {messages.length === 0 && !liveStreamingTask ? (
          <p className="py-12 text-center text-sm text-(--muted)">
            Send a message to create a Fency conversation and start streaming.
          </p>
        ) : null}

        {messages.map((message, index) => (
          <Bubble key={`${message.role}-${index}`} message={message} />
        ))}

        {liveStreamingTask ? (
          <div className="mb-4">
            <Bubble
              message={{
                role: 'USER',
                content: liveUserContent,
              }}
            />
            <div className="mr-auto max-w-[80%]">
              {liveStreamingTask.error ? (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {liveStreamingTask.error.message}
                </div>
              ) : (
                <AgentTaskProgress agentTask={liveStreamingTask} />
              )}
            </div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 gap-2 border-t border-(--border) bg-(--card) p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          disabled={isSubmitting}
          className="min-w-0 flex-1 rounded border border-(--border) bg-transparent px-3 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="rounded border border-(--border) px-4 py-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === 'SYSTEM') {
    return null
  }
  const isUser = message.role === 'USER'
  return (
    <div
      className={
        isUser
          ? 'mb-2 ml-auto w-fit max-w-[80%] rounded-lg bg-blue-500 px-3 py-2 text-white dark:bg-blue-800'
          : 'mb-4 mr-auto max-w-[80%] whitespace-pre-wrap rounded-lg bg-(--card) px-3 py-2'
      }
    >
      {message.content}
    </div>
  )
}
