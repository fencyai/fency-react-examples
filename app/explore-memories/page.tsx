'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { Explorer } from './components/Explorer'
import { SetupGate } from './components/SetupGate'

const fency = loadFency({
  publishableKey: process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY!,
})

async function fetchCreateStreamClientToken() {
  const res = await fetch('/explore-memories/api/stream-session', {
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

export default function ExploreMemoriesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SetupGate>
        <FencyProvider
          fency={fency}
          fetchCreateStreamClientToken={fetchCreateStreamClientToken}
        >
          <Explorer />
        </FencyProvider>
      </SetupGate>
    </div>
  )
}
