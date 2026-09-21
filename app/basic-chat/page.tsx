'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { Chat } from './components/Chat'
import { sessionClientTokenSchema } from './sessionClientTokenSchema'

const publishableKey = process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY
if (!publishableKey) {
  throw new Error('NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY is not defined.')
}

const fency = loadFency({
  publishableKey,
})

async function fetchCreateStreamClientToken() {
  const res = await fetch('/basic-chat/api/create-stream-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create stream session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export default function BasicChatPage() {
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
