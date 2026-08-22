'use client'

import { AgentTaskProgress, useAgentTasks } from '@fencyai/react'
import { useState } from 'react'
import type {
  StructuredConversation,
  StructuredExtraction,
} from './db/schema'
import {
  extractionJsonSchema,
  extractionSchema,
  type Extraction,
} from './extractionSchema'

const SAMPLE_TEXT = `Maya Chen is the Head of Product at Harborline, a logistics startup in Oslo. She previously led marketplace operations at a Nordic retailer. Reach her at maya.chen@harborline.example.`

export function Extractor({
  initialConversation,
  initialExtractions,
}: {
  initialConversation: StructuredConversation | null
  initialExtractions: StructuredExtraction[]
}) {
  const [conversation, setConversation] = useState(initialConversation)
  const [extractions, setExtractions] = useState(initialExtractions)
  const [input, setInput] = useState(SAMPLE_TEXT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestResult, setLatestResult] = useState<Extraction | null>(null)

  const { latest, createAgentTask } = useAgentTasks({})

  async function ensureConversation() {
    if (conversation) {
      return conversation
    }
    const res = await fetch('/structured-chat-completion/api/conversation', {
      method: 'POST',
    })
    if (!res.ok) {
      throw new Error('Failed to create conversation')
    }
    const data = (await res.json()) as { conversation: StructuredConversation }
    setConversation(data.conversation)
    return data.conversation
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setLatestResult(null)

    try {
      const current = await ensureConversation()
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

      const parsed = extractionSchema.parse(
        JSON.parse(response.response.response.jsonResponse),
      )

      const persistRes = await fetch(
        '/structured-chat-completion/api/extractions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: current.id,
            fencyAgentTaskId: response.agentTaskId,
            inputText: trimmed,
            result: parsed,
          }),
        },
      )
      const persistData = (await persistRes.json()) as {
        extraction: StructuredExtraction
      }

      setLatestResult(parsed)
      setExtractions((currentExtractions) => [
        persistData.extraction,
        ...currentExtractions,
      ])
    } catch {
      // Task errors also surface on latest.error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="font-semibold">Structured chat completion</h1>
        <p className="text-sm text-(--muted)">
          Paste free text. Fency returns JSON that matches the Zod schema.
          There are no incremental text events, only a completed result.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={6}
          disabled={isSubmitting}
          className="w-full rounded border border-(--border) bg-(--card) px-3 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="self-start rounded border border-(--border) px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Extracting...' : 'Extract record'}
        </button>
      </form>

      {isSubmitting && latest?.params.type === 'StructuredChatCompletion' ? (
        <div>
          {latest.error ? (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {latest.error.message}
            </div>
          ) : (
            <AgentTaskProgress agentTask={latest} />
          )}
        </div>
      ) : null}

      {latestResult ? <RecordCard title="Latest result" record={latestResult} /> : null}

      <section>
        <h2 className="mb-2 text-sm font-semibold">Previous extractions</h2>
        {extractions.length === 0 ? (
          <p className="text-sm text-(--muted)">
            Nothing stored yet. Extract a record and reload - it will still be
            here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded border border-(--border)">
            <table className="w-full text-left text-sm">
              <thead className="bg-(--card) text-(--muted)">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Company</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {extractions.map((extraction) => {
                  const result = extraction.result as Partial<Extraction>
                  return (
                    <tr key={extraction.id} className="border-t border-(--border)">
                      <td className="px-3 py-2">{result.name}</td>
                      <td className="px-3 py-2">{result.role}</td>
                      <td className="px-3 py-2">{result.company}</td>
                      <td className="px-3 py-2">{result.email}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function RecordCard({ title, record }: { title: string; record: Extraction }) {
  return (
    <section className="rounded-xl border border-(--border) bg-(--card) p-4">
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-(--muted)">Name</dt>
        <dd>{record.name}</dd>
        <dt className="text-(--muted)">Role</dt>
        <dd>{record.role}</dd>
        <dt className="text-(--muted)">Company</dt>
        <dd>{record.company}</dd>
        <dt className="text-(--muted)">Email</dt>
        <dd>{record.email}</dd>
        <dt className="text-(--muted)">Summary</dt>
        <dd>{record.summary}</dd>
      </dl>
    </section>
  )
}
