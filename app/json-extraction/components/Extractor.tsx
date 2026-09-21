'use client'

import { Alert, Badge, Card, Text, Title } from '@mantine/core'
import { AgentTaskProgress } from '@fencyai/react'
import { useJsonExtraction } from '../hooks/useJsonExtraction'
import { ExtractionForm } from './ExtractionForm'
import { RecordCard } from './RecordCard'
import { SchemaPreview } from './SchemaPreview'

export function Extractor() {
  const { latestTask, latestResult, isSubmitting, extract } =
    useJsonExtraction()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div>
        <Badge size="sm" variant="light" color="green" mb={4}>
          Basic
        </Badge>
        <Title order={1} size="h4">
          JSON extraction
        </Title>
        <Text size="sm" c="dimmed">
          Paste free text and get a typed record back.
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
