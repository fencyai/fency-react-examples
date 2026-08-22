import { NextResponse } from 'next/server'
import { createSession } from '../../fency'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string
  }

  if (!body.conversationId) {
    return NextResponse.json(
      { error: 'conversationId is required' },
      { status: 400 },
    )
  }

  return createSession({
    createAgentTask: {
      taskType: 'STREAMING_CHAT_COMPLETION',
      conversationId: body.conversationId,
    },
  })
}
