'use client'

import { Alert, Badge, Text, Title } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import { useStreamingResponse } from '../hooks/useStreamingResponse'
import { PromptForm } from './PromptForm'

export function Streamer() {
  const { latestTask, isSubmitting, generate } = useStreamingResponse()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div>
        <Badge size="sm" variant="light" color="green" mb={4}>
          Basic
        </Badge>
        <Title order={1} size="h4">
          Streaming response
        </Title>
        <Text size="sm" c="dimmed">
          One prompt. The reply streams in as it is generated.
        </Text>
      </div>

      <PromptForm isSubmitting={isSubmitting} onGenerate={generate} />

      {latestTask?.error ? (
        <Alert color="red">{latestTask.error.message}</Alert>
      ) : latestTask ? (
        <AgentTaskProgress agentTask={latestTask} />
      ) : null}
    </div>
  )
}
