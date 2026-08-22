import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { createFencyConversation } from './createFencyConversation'
import { searchFencyConversations } from './searchFencyConversations'

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ok, status, data } = await searchFencyConversations(userId)

  if (!ok) {
    return NextResponse.json(data, { status })
  }

  const conversations = (data.items ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? null,
    createdAt: item.createdAt,
  }))
  return NextResponse.json({ conversations })
}

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ok, status, data } = await createFencyConversation({
    metadata: { userId },
  })

  if (!ok || typeof data.id !== 'string') {
    return NextResponse.json(data, { status })
  }

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
