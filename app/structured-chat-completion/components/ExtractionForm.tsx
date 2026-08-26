'use client'

import { Button, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'

const SAMPLE_TEXT = `Maya Chen is the Head of Product at Harborline, a logistics startup in Oslo. She previously led marketplace operations at a Nordic retailer. Reach her at maya.chen@harborline.example.`

export function ExtractionForm({
  isSubmitting,
  onExtract,
}: {
  isSubmitting: boolean
  onExtract: (text: string) => Promise<void>
}) {
  const [input, setInput] = useState(SAMPLE_TEXT)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSubmitting) {
      return
    }
    await onExtract(text)
  }

  return (
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
  )
}
