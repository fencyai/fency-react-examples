'use client'

import { Button, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'

export function ChatComposer({
  disabled,
  isSubmitting,
  onSend,
}: {
  disabled: boolean
  isSubmitting: boolean
  onSend: (text: string) => Promise<void>
}) {
  const [input, setInput] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || disabled) {
      return
    }
    setInput('')
    await onSend(text)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          rows={3}
          disabled={disabled}
          placeholder="Ask a question over your memories..."
        />
        <Button
          type="submit"
          variant="default"
          loading={isSubmitting}
          disabled={disabled || !input.trim()}
          style={{ alignSelf: 'flex-end' }}
        >
          Explore
        </Button>
      </Stack>
    </form>
  )
}
