import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { createFencyConversation } from './createFencyConversation'

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await createFencyConversation(userId)
  return NextResponse.json(
    {
      conversation: {
        id: data.id,
        title: data.title ?? null,
        createdAt: data.createdAt,
      },
    },
    { status: 201 },
  )
}
