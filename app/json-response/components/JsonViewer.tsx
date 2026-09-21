'use client'

import { Alert, Badge, Text, Title } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import { useJsonResponse } from '../hooks/useJsonResponse'
import { JsonResult } from './JsonResult'
import { PromptForm } from './PromptForm'

export function JsonViewer() {
  const { latestTask, latestResult, isSubmitting, getJson } = useJsonResponse()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div>
        <Badge size="sm" variant="light" color="green" mb={4}>
          Basic
        </Badge>
        <Title order={1} size="h4">
          JSON response
        </Title>
        <Text size="sm" c="dimmed">
          Name a city. The reply is a JSON object with a string, a boolean, and
          a number.
        </Text>
      </div>

      <PromptForm isSubmitting={isSubmitting} onGetJson={getJson} />

      {latestTask?.error ? (
        <Alert color="red">{latestTask.error.message}</Alert>
      ) : latestTask ? (
        <AgentTaskProgress agentTask={latestTask} />
      ) : null}

      {latestResult ? <JsonResult result={latestResult} /> : null}
    </div>
  )
}
