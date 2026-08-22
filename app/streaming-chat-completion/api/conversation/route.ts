import { NextResponse } from 'next/server'
import {
  getConversation,
  getLatestConversation,
  insertConversation,
  listMessages,
} from '../../db/queries'
import { fencyFetch } from '../../fency'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const conversation = id ? await getConversation(id) : await getLatestConversation()

  if (!conversation) {
    return NextResponse.json({ conversation: null, messages: [] })
  }

  const messages = await listMessages(conversation.id)
  return NextResponse.json({ conversation, messages })
}

export async function POST() {
  const response = await fencyFetch('/v1/conversations', {
    method: 'POST',
    body: JSON.stringify({
      metadata: { example: 'streaming-chat-completion' },
    }),
  })
  const data = (await response.json()) as { id?: string; error?: unknown }

  if (!response.ok || typeof data.id !== 'string') {
    return NextResponse.json(data, { status: response.status })
  }

  const conversation = await insertConversation({
    fencyConversationId: data.id,
  })
  return NextResponse.json({ conversation, messages: [] }, { status: 201 })
}
