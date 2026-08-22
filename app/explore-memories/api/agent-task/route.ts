import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { getFencyConversation } from '../getFencyConversation'
import { listFencyAgentTasks } from './listFencyAgentTasks'

export async function GET(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversationId = new URL(request.url).searchParams.get('conversationId')
  if (!conversationId) {
    return NextResponse.json(
      { error: 'conversationId is required' },
      { status: 400 },
    )
  }

  const conversation = await getFencyConversation(conversationId)
  if (!conversation.ok) {
    return NextResponse.json(conversation.data, { status: conversation.status })
  }

  if (conversation.data.metadata?.userId !== userId) {
    return NextResponse.json(
      { error: 'Conversation does not belong to this user' },
      { status: 403 },
    )
  }

  const { ok, status, data } = await listFencyAgentTasks(conversationId)
  return NextResponse.json(data, { status: ok ? 200 : status })
}
