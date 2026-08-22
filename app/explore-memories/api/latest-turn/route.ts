import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { listFencyAgentTasks } from '../agent-task/listFencyAgentTasks'
import { getFencyConversation } from '../getFencyConversation'
import { buildConversationTurnFromArchive } from './buildConversationTurnFromArchive'
import { resolveRequestOrigin } from './resolveRequestOrigin'

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

  const tasks = await listFencyAgentTasks(conversationId, {
    asc: true,
    limit: 100,
  })
  if (!tasks.ok) {
    return NextResponse.json(tasks.data, { status: tasks.status })
  }

  const exploreTasks = (tasks.data.items ?? []).filter(
    (task) => task.taskType === 'EXPLORE_MEMORIES',
  )
  const latestTask = exploreTasks[exploreTasks.length - 1]
  if (!latestTask) {
    return NextResponse.json({ latestTurn: null })
  }

  try {
    const latestTurn = await buildConversationTurnFromArchive(
      latestTask.id,
      resolveRequestOrigin(request),
    )
    return NextResponse.json({ latestTurn })
  } catch (error) {
    console.error('Failed to load latest agent task response:', error)
    return NextResponse.json(
      { error: 'Could not load conversation history from Fency.' },
      { status: 502 },
    )
  }
}
