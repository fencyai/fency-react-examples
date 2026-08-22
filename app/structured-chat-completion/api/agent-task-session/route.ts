import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { createFencySession } from '../createFencySession'

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return createFencySession({
    createAgentTask: {
      taskType: 'STRUCTURED_CHAT_COMPLETION',
      metadata: { userId },
    },
  })
}
