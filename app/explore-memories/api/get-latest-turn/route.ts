import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { getFencyConversation } from '../getFencyConversation'
import { buildConversationTurnFromArchive } from './buildConversationTurnFromArchive'
import { listFencyAgentTasks } from './listFencyAgentTasks'
import { resolveRequestOrigin } from './resolveRequestOrigin'

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
  const exploreTasks = (tasks.items ?? []).filter(
    (task) => task.taskType === 'EXPLORE_MEMORIES',
  )
  const latestTask = exploreTasks[exploreTasks.length - 1]
  if (!latestTask) {
    return NextResponse.json({ latestTurn: null })
  }

  const latestTurn = await buildConversationTurnFromArchive(
    latestTask.id,
    resolveRequestOrigin(request),
  )
  return NextResponse.json({ latestTurn })
}
