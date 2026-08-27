'use client'

import { useAgentTasks } from '@fencyai/react'
import { useCallback, useMemo, useState } from 'react'
import { ANALYSIS_MODEL } from '../documentAnalysisConstants'
import type { DataPoint } from '../dataPoint'
import type {
  DataPointSearch,
  DataPointSearchWithTask,
} from '../dataPointSearch'
import {
  dataPointJsonSchema,
  dataPointZodSchema,
} from '../dataPointJsonSchema'
import { formatMemorySearchSnippets } from '../formatMemorySearchSnippets'
import { sessionClientTokenSchema } from '../sessionClientTokenSchema'

async function fetchCreateMemorySearchClientToken(documentId: string) {
  const res = await fetch(
    '/document-analysis/api/create-memory-search-agent-task-session',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    },
  )
  if (!res.ok) {
    throw new Error('Failed to create MemorySearch session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

async function fetchCreateStructuredClientToken() {
  const res = await fetch(
    '/document-analysis/api/create-structured-agent-task-session',
    { method: 'POST' },
  )
  if (!res.ok) {
    throw new Error('Failed to create structured task session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export function useDocumentAnalysis() {
  const { agentTasks, createAgentTask } = useAgentTasks({})
  const [extracted, setExtracted] = useState<Record<string, unknown> | null>(
    null,
  )
  const [pipelineError, setPipelineError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isStructuring, setIsStructuring] = useState(false)
  const [dataPointSearches, setDataPointSearches] = useState<
    DataPointSearch[]
  >([])
  const [structuringTaskKey, setStructuringTaskKey] = useState<string | null>(
    null,
  )

  const dataPointSearchesWithTasks = useMemo((): DataPointSearchWithTask[] => {
    return dataPointSearches.map((search) => ({
      ...search,
      task: agentTasks.find((task) => task.taskKey === search.taskKey),
    }))
  }, [agentTasks, dataPointSearches])

  const structuringTask = useMemo(
    () =>
      agentTasks.find((task) => task.taskKey === structuringTaskKey),
    [agentTasks, structuringTaskKey],
  )

  const analyze = useCallback(
    async (documentId: string, dataPoints: DataPoint[]) => {
      setExtracted(null)
      setPipelineError(null)
      setDataPointSearches([])
      setStructuringTaskKey(null)
      setIsSearching(true)
      setIsStructuring(false)

      const aggregated: string[] = []

      try {
        for (const dataPoint of dataPoints) {
          const query = dataPoint.description
            ? `Extract ${dataPoint.label} (${dataPoint.description}) from the document.`
            : `Extract ${dataPoint.label} from the document.`

          const searchResult = await createAgentTask(
            {
              type: 'MemorySearch',
              query,
              model: ANALYSIS_MODEL,
              language: 'en',
              chunkLimit: 5,
              contextExpansion: { before: 1, after: 1 },
            },
            {
              fetchCreateAgentTaskClientToken: () =>
                fetchCreateMemorySearchClientToken(documentId),
              onTaskRegistered: (task) => {
                setDataPointSearches((prev) => [
                  ...prev,
                  {
                    taskKey: task.taskKey,
                    label: dataPoint.label,
                    query,
                  },
                ])
              },
            },
          )

          if (searchResult.type !== 'success') {
            setPipelineError(searchResult.error.message)
            break
          }

          const terminal = searchResult.response
          if (
            terminal.taskType === 'MemorySearch' &&
            terminal.eventType === 'Completed'
          ) {
            aggregated.push(
              `# ${dataPoint.label}\n${formatMemorySearchSnippets(terminal.response)}`,
            )
          } else {
            setPipelineError('Unexpected MemorySearch outcome.')
            break
          }
        }

        setIsSearching(false)

        if (aggregated.length < dataPoints.length) {
          return
        }

        setIsStructuring(true)
        const schema = dataPointZodSchema(dataPoints)
        const jsonSchema = dataPointJsonSchema(dataPoints)

        const structResult = await createAgentTask(
          {
            type: 'StructuredChatCompletion',
            messages: [
              {
                role: 'SYSTEM',
                content:
                  'Merge facts from the labelled document search excerpts into the JSON schema. Use only information clearly supported by the excerpts. Leave a field null when it cannot be inferred.',
              },
              {
                role: 'USER',
                content: aggregated.join('\n\n---\n\n'),
              },
            ],
            jsonSchema,
            model: ANALYSIS_MODEL,
            temperature: 0.1,
          },
          {
            fetchCreateAgentTaskClientToken: fetchCreateStructuredClientToken,
            onTaskRegistered: (task) => {
              setStructuringTaskKey(task.taskKey)
            },
          },
        )

        if (structResult.type !== 'success') {
          setPipelineError(structResult.error.message)
          return
        }

        const event = structResult.response
        if (
          event.taskType !== 'StructuredChatCompletion' ||
          event.eventType !== 'Completed'
        ) {
          setPipelineError('Unexpected structured extraction response.')
          return
        }

        setExtracted(schema.parse(JSON.parse(event.response.jsonResponse)))
      } catch (err) {
        setPipelineError(
          err instanceof Error ? err.message : 'Analysis pipeline failed.',
        )
      } finally {
        setIsSearching(false)
        setIsStructuring(false)
      }
    },
    [createAgentTask],
  )

  return {
    analyze,
    extracted,
    pipelineError,
    isSearching,
    isStructuring,
    isRunning: isSearching || isStructuring,
    dataPointSearchesWithTasks,
    structuringTask,
  }
}
