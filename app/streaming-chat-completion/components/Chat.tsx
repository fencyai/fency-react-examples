'use client'

import { Alert, Button, Group, Text, TextInput, Title } from '@mantine/core'
import { AgentTaskProgress, useAgentTasks } from '@fencyai/react'
import { useEffect, useRef, useState } from 'react'
import { Bubble, type ChatMessage } from './Bubble'

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskOffset, setTaskOffset] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { agentTasks, createAgentTask } = useAgentTasks({})

  const streamingTasks = agentTasks
    .filter((task) => task.params.type === 'StreamingChatCompletion')
    .slice(taskOffset)
  const userMessages = messages.filter((message) => message.role === 'USER')

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, streamingTasks, isSubmitting])

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
    setMessages(nextMessages)

    try {
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
              { method: 'POST' },
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
      if (assistant?.role === 'ASSISTANT') {
        setMessages([
          ...nextMessages,
          { role: 'ASSISTANT', content: assistant.content },
        ])
      }
    } catch {
      // Task errors also surface on the agent task
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

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
      <Group justify="space-between" align="flex-start" px="md" py="sm" wrap="nowrap">
        <div>
          <Title order={1} size="h4">
            Streaming chat completion
          </Title>
          <Text size="sm" c="dimmed">
            Tokens stream in as they are generated.
          </Text>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setMessages([])
            setTaskOffset(agentTasks.length)
          }}
        >
          New chat
        </Button>
      </Group>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {userMessages.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Send a message to start streaming.
          </Text>
        ) : null}

        {userMessages.map((message, index) => {
          const task = streamingTasks[index]
          return (
            <div key={`${message.role}-${index}`}>
              <Bubble message={message} />
              {task?.error ? (
                <Alert color="red" mb="md">
                  {task.error.message}
                </Alert>
              ) : task ? (
                <div className="mb-4 w-full">
                  <AgentTaskProgress agentTask={task} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 gap-2 border-t border-(--border) bg-(--card) p-4"
      >
        <TextInput
          style={{ flex: 1 }}
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="Type a message..."
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || !input.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  )
}
