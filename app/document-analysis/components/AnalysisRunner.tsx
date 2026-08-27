'use client'

import { Alert, Button, Stack, Text, Title } from '@mantine/core'
import { AgentTaskProgress, type AgentTask } from '@fencyai/react'
import { useState } from 'react'
import type { AnalyzedDocument } from '../analyzedDocument'
import type { DataPoint } from '../dataPoint'
import type { DataPointSearchWithTask } from '../dataPointSearch'
import { DataPointSearchCard } from './DataPointSearchCard'
import { DataPointSearchProgressModal } from './DataPointSearchProgressModal'
import { ExtractedDataPointTable } from './ExtractedDataPointTable'

export function AnalysisRunner({
  document,
  dataPoints,
  isRunning,
  isSearching,
  isStructuring,
  pipelineError,
  dataPointSearchesWithTasks,
  structuringTask,
  extracted,
  onAnalyze,
}: {
  document: AnalyzedDocument
  dataPoints: DataPoint[]
  isRunning: boolean
  isSearching: boolean
  isStructuring: boolean
  pipelineError: string | null
  dataPointSearchesWithTasks: DataPointSearchWithTask[]
  structuringTask: AgentTask | undefined
  extracted: Record<string, unknown> | null
  onAnalyze: () => void
}) {
  const ready = document.contentStatus === 'SYNCHRONIZED'
  const [openTaskKey, setOpenTaskKey] = useState<string | null>(null)
  const openSearch =
    dataPointSearchesWithTasks.find(
      (search) => search.taskKey === openTaskKey,
    ) ?? null

  return (
    <Stack gap="sm">
      <div>
        <Title order={2} size="h5">
          Analyze {document.fileName}
        </Title>
        <Text size="sm" c="dimmed">
          {ready
            ? 'One MemorySearch per data point, then one StructuredChatCompletion.'
            : document.contentStatus === 'SYNCHRONIZATION_ERROR'
              ? 'Indexing failed. Upload the PDF again.'
              : 'Waiting for the memory.updated webhook with contentStatus SYNCHRONIZED.'}
        </Text>
      </div>
      <Button
        variant="default"
        onClick={onAnalyze}
        disabled={!ready || isRunning || dataPoints.length === 0}
        loading={isRunning}
        style={{ alignSelf: 'flex-start' }}
      >
        {isSearching
          ? 'Searching...'
          : isStructuring
            ? 'Extracting...'
            : 'Analyze document'}
      </Button>
      {pipelineError ? <Alert color="red">{pipelineError}</Alert> : null}
      {extracted ? (
        <ExtractedDataPointTable
          dataPoints={dataPoints}
          extracted={extracted}
        />
      ) : null}
      {isStructuring && structuringTask ? (
        <AgentTaskProgress agentTask={structuringTask} />
      ) : null}
      {[...dataPointSearchesWithTasks].reverse().map((search) => (
        <DataPointSearchCard
          key={search.taskKey}
          search={search}
          onOpen={() => setOpenTaskKey(search.taskKey)}
        />
      ))}
      <DataPointSearchProgressModal
        search={openSearch}
        onClose={() => setOpenTaskKey(null)}
      />
    </Stack>
  )
}
