'use client'

import { Alert, Button, Stack, Text, Textarea, Title } from '@mantine/core'
import { AgentTaskProgress, useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import {
  extractionJsonSchema,
  extractionSchema,
  type Extraction,
} from '../extractionSchema'
import { RecordCard } from './RecordCard'
import { SchemaPreview } from './SchemaPreview'

const SAMPLE_TEXT = `Maya Chen is the Head of Product at Harborline, a logistics startup in Oslo. She previously led marketplace operations at a Nordic retailer. Reach her at maya.chen@harborline.example.`

export function Extractor() {
  const [input, setInput] = useState(SAMPLE_TEXT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestResult, setLatestResult] = useState<Extraction | null>(null)

  const { latest, createAgentTask } = useAgentTasks({})

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setLatestResult(null)

    try {
      const response = await createAgentTask(
        {
          type: 'StructuredChatCompletion',
          messages: [
            {
              role: 'SYSTEM',
              content:
                'Extract a single person record from the user text. Use empty strings for fields that are not mentioned.',
            },
            { role: 'USER', content: trimmed },
          ],
          model: 'anthropic/claude-sonnet-4.6',
          jsonSchema: extractionJsonSchema,
        },
        {
          fetchCreateAgentTaskClientToken: async () => {
            const res = await fetch(
              '/structured-chat-completion/api/agent-task-session',
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
        response.response.taskType !== 'StructuredChatCompletion'
      ) {
        return
      }

      setLatestResult(
        extractionSchema.parse(
          JSON.parse(response.response.response.jsonResponse),
        ),
      )
    } catch {
      // Task errors also surface on latest.error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <div>
        <Title order={1} size="h4">
          Structured chat completion
        </Title>
        <Text size="sm" c="dimmed">
          Paste free text. Fency returns JSON that matches the Zod schema.
          There are no incremental text events, only a completed result.
        </Text>
        <div className="mt-2">
          <SchemaPreview />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            rows={6}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !input.trim()}
            style={{ alignSelf: 'flex-start' }}
          >
            {isSubmitting ? 'Extracting...' : 'Extract record'}
          </Button>
        </Stack>
      </form>

      {isSubmitting && latest?.params.type === 'StructuredChatCompletion' ? (
        latest.error ? (
          <Alert color="red">{latest.error.message}</Alert>
        ) : (
          <AgentTaskProgress agentTask={latest} />
        )
      ) : null}

      {latestResult ? <RecordCard title="Latest result" record={latestResult} /> : null}
    </div>
  )
}
