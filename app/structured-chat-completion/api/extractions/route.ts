import { NextResponse } from 'next/server'
import { getConversation, insertExtraction } from '../../db/queries'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    conversationId?: string
    fencyAgentTaskId?: string
    inputText?: string
    result?: Record<string, unknown>
  }

  if (!body.conversationId || !body.inputText || !body.result) {
    return NextResponse.json(
      { error: 'conversationId, inputText, and result are required' },
      { status: 400 },
    )
  }

  const conversation = await getConversation(body.conversationId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  const extraction = await insertExtraction({
    conversationId: conversation.id,
    fencyAgentTaskId: body.fencyAgentTaskId,
    inputText: body.inputText,
    result: body.result,
  })

  return NextResponse.json({ extraction }, { status: 201 })
}
