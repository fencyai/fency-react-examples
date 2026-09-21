'use client'

import { Button, TextInput } from '@mantine/core'
import { useState } from 'react'

export function ChatComposer({
  isSubmitting,
  onSend,
}: {
  isSubmitting: boolean
  onSend: (text: string) => Promise<void>
}) {
  const [input, setInput] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSubmitting) {
      return
    }
    setInput('')
    await onSend(text)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 gap-3 border-t border-(--border) bg-(--card) px-4 py-4"
    >
      <TextInput
        radius="md"
        style={{ flex: 1 }}
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Type a message..."
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        radius="md"
        disabled={isSubmitting || !input.trim()}
      >
        Send
      </Button>
    </form>
  )
}
