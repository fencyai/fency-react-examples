import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
        taskType: 'STRUCTURED_CHAT_COMPLETION',
        metadata: { userId },
      },
    }),
  })
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
