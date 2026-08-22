import { NextResponse } from 'next/server'
import {
  getConversation,
  getLatestConversation,
  insertConversation,
  listExtractions,
} from '../../db/queries'
import { fencyFetch } from '../../fency'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const conversation = id ? await getConversation(id) : await getLatestConversation()

  if (!conversation) {
    return NextResponse.json({ conversation: null, extractions: [] })
  }

  const extractions = await listExtractions(conversation.id)
  return NextResponse.json({ conversation, extractions })
}

export async function POST() {
  const response = await fencyFetch('/v1/conversations', {
    method: 'POST',
    body: JSON.stringify({
      metadata: { example: 'structured-chat-completion' },
    }),
  })
  const data = (await response.json()) as { id?: string; error?: unknown }

  if (!response.ok || typeof data.id !== 'string') {
    return NextResponse.json(data, { status: response.status })
  }

  const conversation = await insertConversation({
    fencyConversationId: data.id,
  })
  return NextResponse.json({ conversation, extractions: [] }, { status: 201 })
}
