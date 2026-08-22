'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { Chat } from './components/Chat'

const fency = loadFency({
  publishableKey: process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY!,
})

async function fetchCreateStreamClientToken() {
  const res = await fetch('/streaming-chat-completion/api/stream-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create stream session')
  }
  const data = (await res.json()) as { clientToken?: string }
  if (!data.clientToken) {
    throw new Error('No clientToken in session response')
  }
  return { clientToken: data.clientToken }
}

export default function StreamingChatCompletionPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <FencyProvider
        fency={fency}
        fetchCreateStreamClientToken={fetchCreateStreamClientToken}
      >
        <Chat />
      </FencyProvider>
    </div>
  )
}
