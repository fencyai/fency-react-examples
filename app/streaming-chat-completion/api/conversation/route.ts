import { NextResponse } from 'next/server'
import {
  getConversation,
  getLatestConversation,
  insertConversation,
  listMessages,
} from '../../db/queries'

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
  const conversation = await insertConversation()
  return NextResponse.json({ conversation, messages: [] }, { status: 201 })
}
