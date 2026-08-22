import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { getExampleVersionTag } from '../../../exampleVersionTag'
import { getSyncedCarCatalog } from '../../db/queries'
import { createFencySession } from '../createFencySession'
import { getFencyConversation } from '../getFencyConversation'
import { buildExploreCarGuardRails } from './buildExploreCarGuardRails'

export async function POST(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string
  }

  if (!body.conversationId) {
    return NextResponse.json(
      { error: 'conversationId is required' },
      { status: 400 },
    )
  }

  const conversation = await getFencyConversation(body.conversationId)
  if (!conversation.ok) {
    return NextResponse.json(conversation.data, { status: conversation.status })
  }

  if (conversation.data.metadata?.userId !== userId) {
    return NextResponse.json(
      { error: 'Conversation does not belong to this user' },
      { status: 403 },
    )
  }

  const versionTag = getExampleVersionTag('explore-memories')
  const catalog = await getSyncedCarCatalog(userId, versionTag)
  if (!catalog) {
    return NextResponse.json(
      { error: 'Create the DemoCar catalog before exploring memories.' },
      { status: 409 },
    )
  }

  return createFencySession({
    createAgentTask: {
      taskType: 'EXPLORE_MEMORIES',
      conversationId: body.conversationId,
      metadata: { userId },
      background: 'You help the user explore a catalog of 100 cars.',
      guardRails: buildExploreCarGuardRails(
        catalog.memoryTypeId,
        catalog.versionTag,
        userId,
      ),
    },
  })
}
