'use client'

import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { DocumentAnalyzer } from './components/DocumentAnalyzer'
import { sessionClientTokenSchema } from './sessionClientTokenSchema'

const fency = loadFency({
  publishableKey: process.env.NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY!,
})

async function fetchCreateStreamClientToken() {
  const res = await fetch('/document-analysis/api/create-stream-session', {
    method: 'POST',
  })
  if (!res.ok) {
    throw new Error('Failed to create stream session')
  }
  const { clientToken } = sessionClientTokenSchema.parse(await res.json())
  return { clientToken }
}

export default function DocumentAnalysisPage() {
  return (
    <FencyProvider
      fency={fency}
      fetchCreateStreamClientToken={fetchCreateStreamClientToken}
    >
      <DocumentAnalyzer />
    </FencyProvider>
  )
}
