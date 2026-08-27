'use client'

import { Alert, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import type { AnalyzedDocument } from '../analyzedDocument'
import { useDataPoints } from '../hooks/useDataPoints'
import { useDocumentAnalysis } from '../hooks/useDocumentAnalysis'
import { useDocuments } from '../hooks/useDocuments'
import { AnalysisRunner } from './AnalysisRunner'
import { DataPointForm } from './DataPointForm'
import { DocumentList } from './DocumentList'
import { DocumentUploader } from './DocumentUploader'

export function DocumentAnalyzer() {
  const { dataPoints, addDataPoint, updateDataPoint, removeDataPoint } =
    useDataPoints()
  const { documents, isLoading, error, setError, registerUploaded } =
    useDocuments()
  const {
    analyze,
    extracted,
    pipelineError,
    isSearching,
    isStructuring,
    isRunning,
    dataPointSearchesWithTasks,
    structuringTask,
  } = useDocumentAnalysis()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected =
    documents.find((document) => document.id === selectedId) ?? null

  function handleUploaded(document: AnalyzedDocument) {
    registerUploaded(document)
    setSelectedId(document.id)
  }

  function handleSelect(document: AnalyzedDocument) {
    setSelectedId(document.id)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6">
      <div>
        <Title order={1} size="h4">
          Document analysis
        </Title>
        <Text size="sm" c="dimmed">
          Upload a PDF, wait until Fency indexes it, then extract typed data
          points with MemorySearch.
        </Text>
      </div>

      <DataPointForm
        dataPoints={dataPoints}
        disabled={isRunning}
        onAdd={addDataPoint}
        onChange={updateDataPoint}
        onRemove={removeDataPoint}
      />

      <DocumentUploader onUploaded={handleUploaded} onError={setError} />

      {error ? <Alert color="red">{error}</Alert> : null}

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {selected ? (
        <AnalysisRunner
          document={selected}
          dataPoints={dataPoints}
          isRunning={isRunning}
          isSearching={isSearching}
          isStructuring={isStructuring}
          pipelineError={pipelineError}
          dataPointSearchesWithTasks={dataPointSearchesWithTasks}
          structuringTask={structuringTask}
          extracted={extracted}
          onAnalyze={() => {
            void analyze(selected.id, dataPoints)
          }}
        />
      ) : (
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Select a synchronized document to run analysis.
          </Text>
        </Stack>
      )}
    </div>
  )
}
