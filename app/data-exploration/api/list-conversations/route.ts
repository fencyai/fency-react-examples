import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { searchFencyConversations } from './searchFencyConversations'

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const items = await searchFencyConversations(userId)
  const conversations = items.map((item) => ({
    id: item.id,
    title: item.title ?? null,
    createdAt: item.createdAt,
  }))
  return NextResponse.json({ conversations })
}
