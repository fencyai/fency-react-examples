import { NextResponse } from 'next/server'
import {
  getConversation,
  insertMessages,
  updateConversationTitle,
} from '../../db/queries'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    conversationId?: string
    fencyAgentTaskId?: string
    messages?: Array<{ role: string; content: string }>
  }

  if (!body.conversationId || !body.messages?.length) {
    return NextResponse.json(
      { error: 'conversationId and messages are required' },
      { status: 400 },
    )
  }

  const conversation = await getConversation(body.conversationId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  const saved = await insertMessages(
    conversation.id,
    body.messages.map((message) => ({
      role: message.role,
      content: message.content,
      fencyAgentTaskId: body.fencyAgentTaskId,
    })),
  )

  if (!conversation.title) {
    const firstUser = body.messages.find((message) => message.role === 'USER')
    if (firstUser) {
      await updateConversationTitle(
        conversation.id,
        firstUser.content.slice(0, 80),
      )
    }
  }

  return NextResponse.json({ messages: saved }, { status: 201 })
}
