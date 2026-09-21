'use client'

import { Alert } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import type { Turn } from '../hooks/useStreamingChat'
import { Bubble } from './Bubble'

export function ChatTurn({ turn }: { turn: Turn }) {
  const { userMessage, agentTask } = turn
  return (
    <div className="flex flex-col gap-2">
      <Bubble message={userMessage} />
      {agentTask?.error ? (
        <Alert color="red">
          {agentTask.error.message}
        </Alert>
      ) : agentTask ? (
        <div className="w-full">
          <AgentTaskProgress agentTask={agentTask} />
        </div>
      ) : null}
    </div>
  )
}
