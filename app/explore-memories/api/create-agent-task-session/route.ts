import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthorizedUserId } from '../../../auth'
import { getSyncedCarCatalog } from './getSyncedCarCatalog'
import { getExploreMemoriesVersionTag } from '../../versionTag'
import { getFencyConversation } from '../getFencyConversation'
import { buildExploreCarGuardRails } from './buildExploreCarGuardRails'

const bodySchema = z.object({
  conversationId: z.string(),
})

export async function POST(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversationId } = bodySchema.parse(await request.json())

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

  const versionTag = getExploreMemoriesVersionTag()
  const catalog = await getSyncedCarCatalog(userId, versionTag)
  if (!catalog) {
    return NextResponse.json(
      { error: 'Create the DemoCar catalog before exploring memories.' },
      { status: 409 },
    )
  }

  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  const response = await fetch('https://api.fency.ai/v1/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      createAgentTask: {
        taskType: 'EXPLORE_MEMORIES',
        conversationId,
        metadata: { userId },
        background: 'You help the user explore a catalog of cars.',
        guardRails: buildExploreCarGuardRails(
          catalog.memoryTypeId,
          catalog.versionTag,
          userId,
        ),
      },
    }),
  })
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
