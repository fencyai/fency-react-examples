import { NextResponse } from 'next/server'
import {
  getConversation,
  insertQuery,
  updateConversationTitle,
} from '../../db/queries'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    conversationId?: string
    query?: string
    fencyAgentTaskId?: string
  }

  if (!body.conversationId || !body.query) {
    return NextResponse.json(
      { error: 'conversationId and query are required' },
      { status: 400 },
    )
  }

  const conversation = await getConversation(body.conversationId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  const saved = await insertQuery({
    conversationId: conversation.id,
    query: body.query,
    fencyAgentTaskId: body.fencyAgentTaskId,
  })

  if (!conversation.title) {
    await updateConversationTitle(conversation.id, body.query.slice(0, 80))
  }

  return NextResponse.json({ query: saved }, { status: 201 })
}
