'use client'

import { Alert, Card, Text, Title } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import { useStructuredExtraction } from '../hooks/useStructuredExtraction'
import { ExtractionForm } from './ExtractionForm'
import { RecordCard } from './RecordCard'
import { SchemaPreview } from './SchemaPreview'

export function Extractor() {
  const { latestTask, latestResult, isSubmitting, extract } =
    useStructuredExtraction()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div>
        <Title order={1} size="h4">
          Structured chat completion
        </Title>
        <Text size="sm" c="dimmed">
          Paste free text. Fency returns JSON that matches the Zod schema.
          There are no incremental text events, only a completed result.
        </Text>
      </div>

      <Card withBorder padding="lg" radius="md">
        <Title order={2} size="h5" mb="sm">
          Schema
        </Title>
        <SchemaPreview />
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Title order={2} size="h5" mb="sm">
          Source text
        </Title>
        <ExtractionForm isSubmitting={isSubmitting} onExtract={extract} />
      </Card>

      {latestTask?.error ? (
        <Alert color="red">{latestTask.error.message}</Alert>
      ) : latestTask ? (
        <AgentTaskProgress agentTask={latestTask} />
      ) : null}

      {latestResult ? (
        <RecordCard title="Latest result" record={latestResult} />
      ) : null}
    </div>
  )
}
