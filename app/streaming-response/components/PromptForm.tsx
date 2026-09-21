'use client'

import { Button, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'

export function PromptForm({
  isSubmitting,
  onGenerate,
}: {
  isSubmitting: boolean
  onGenerate: (prompt: string) => Promise<void>
}) {
  const [input, setInput] = useState('Explain streaming responses in one paragraph.')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const prompt = input.trim()
    if (!prompt || isSubmitting) {
      return
    }
    await onGenerate(prompt)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Textarea
          radius="md"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          rows={4}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          style={{ alignSelf: 'flex-start' }}
        >
          {isSubmitting ? 'Generating...' : 'Generate'}
        </Button>
      </Stack>
    </form>
  )
}
