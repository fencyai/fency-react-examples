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
      className="flex shrink-0 gap-2 border-t border-(--border) bg-(--card) p-4"
    >
      <TextInput
        style={{ flex: 1 }}
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Type a message..."
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        variant="default"
        disabled={isSubmitting || !input.trim()}
      >
        Send
      </Button>
    </form>
  )
}
