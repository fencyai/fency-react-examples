import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { getFencyConversation } from '../getFencyConversation'
import { listFencyAgentTasks } from './listFencyAgentTasks'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversationId = new URL(request.url).searchParams.get('conversationId')
  if (!conversationId) {
    throw new Error('conversationId is required')
  }

  const conversation = await getFencyConversation(conversationId)
  if (!conversation.ok) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: conversation.status },
    )
  }

  if (conversation.data.metadata.userId !== userId) {
    return NextResponse.json(
      { error: 'Conversation does not belong to this user' },
      { status: 403 },
    )
  }

  const tasks = await listFencyAgentTasks(conversationId)
  return NextResponse.json({
    agentTasks: (tasks.items ?? []).map((task) => ({
      id: task.id,
      taskType: task.taskType,
    })),
  })
}
