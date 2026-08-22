'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import type { ReactNode } from 'react'

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

export function Provider({ children }: { children: ReactNode }) {
  return (
    <FencyProvider
      fency={fency}
      fetchCreateStreamClientToken={fetchCreateStreamClientToken}
    >
      {children}
    </FencyProvider>
  )
}
