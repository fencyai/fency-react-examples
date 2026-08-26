'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { Explorer } from './components/Explorer'
import { SetupGate } from './components/SetupGate'
import { sessionClientTokenSchema } from './sessionClientTokenSchema'

const fency = loadFency({
  publishableKey: process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY!,
})

async function fetchCreateStreamClientToken() {
  const res = await fetch('/explore-memories/api/create-stream-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create stream session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
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
