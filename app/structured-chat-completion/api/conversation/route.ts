import { NextResponse } from 'next/server'
import {
  getConversation,
  getLatestConversation,
  insertConversation,
  listExtractions,
} from '../../db/queries'

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
  const conversation = await insertConversation()
  return NextResponse.json({ conversation, extractions: [] }, { status: 201 })
}
