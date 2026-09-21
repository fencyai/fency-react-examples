'use client'

import { Button, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'

export function PromptForm({
  isSubmitting,
  onGetJson,
}: {
  isSubmitting: boolean
  onGetJson: (prompt: string) => Promise<void>
}) {
  const [input, setInput] = useState('Bergen, Norway')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const prompt = input.trim()
    if (!prompt || isSubmitting) {
      return
    }
    await onGetJson(prompt)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Textarea
          label="City"
          description="Type a city name. The reply is JSON about that city."
          radius="md"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          rows={2}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          style={{ alignSelf: 'flex-start' }}
        >
          {isSubmitting ? 'Getting JSON...' : 'Get JSON'}
        </Button>
      </Stack>
    </form>
  )
}
