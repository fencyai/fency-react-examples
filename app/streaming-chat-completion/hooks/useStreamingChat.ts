'use client'

import { useAgentTasks, type AgentTask } from '@fencyai/react'
import { useState } from 'react'
import type { ChatMessage } from '../ChatMessage'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'

export type Turn = {
  userMessage: ChatMessage
  agentTask?: AgentTask
}

async function fetchCreateAgentTaskClientToken() {
  const res = await fetch(
    '/streaming-chat-completion/api/create-agent-task-session',
    { method: 'POST' },
  )
  if (!res.ok) {
    throw new Error('Failed to create agent task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useStreamingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskOffset, setTaskOffset] = useState(0)

  const { agentTasks, createAgentTask } = useAgentTasks({})

  const streamingTasks = agentTasks
    .filter((task) => task.params.type === 'StreamingChatCompletion')
    .slice(taskOffset)

  const turns: Turn[] = messages
    .filter((message) => message.role === 'USER')
    .map((userMessage, index) => ({
      userMessage,
      agentTask: streamingTasks[index],
    }))

  async function sendMessage(text: string) {
    setIsSubmitting(true)
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'USER', content: text },
    ]
    setMessages(nextMessages)

    try {
      const response = await createAgentTask(
        {
          type: 'StreamingChatCompletion',
          messages: nextMessages,
          model: 'anthropic/claude-sonnet-4.6',
        },
        { fetchCreateAgentTaskClientToken },
      )

      if (
        response.type === 'success' &&
        response.response.taskType === 'StreamingChatCompletion'
      ) {
        const assistant = response.response.response.messages.at(-1)
        if (assistant?.role === 'ASSISTANT') {
          setMessages([
            ...nextMessages,
            { role: 'ASSISTANT', content: assistant.content },
          ])
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function startNewChat() {
    setMessages([])
    setTaskOffset(agentTasks.length)
  }

  return { turns, isSubmitting, sendMessage, startNewChat }
}
