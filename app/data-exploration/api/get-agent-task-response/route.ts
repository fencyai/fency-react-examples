import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { buildConversationTurnFromArchive } from './buildConversationTurnFromArchive'
import { getFencyAgentTask } from './getFencyAgentTask'
import { resolveRequestOrigin } from './resolveRequestOrigin'

export async function GET(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agentTaskId = new URL(request.url).searchParams.get('agentTaskId')
  if (!agentTaskId) {
    throw new Error('agentTaskId is required')
  }

  const agentTask = await getFencyAgentTask(agentTaskId)
  if (!agentTask.ok) {
    return NextResponse.json(
      { error: 'Agent task not found' },
      { status: agentTask.status },
    )
  }

  if (agentTask.data.metadata.userId !== userId) {
    return NextResponse.json(
      { error: 'Agent task does not belong to this user' },
      { status: 403 },
    )
  }

  const turn = await buildConversationTurnFromArchive(
    agentTaskId,
    resolveRequestOrigin(request),
  )
  return NextResponse.json({ turn })
}
