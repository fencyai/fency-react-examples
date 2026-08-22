import 'server-only'

import { NextResponse } from 'next/server'

export async function createFencySession(body: Record<string, unknown>) {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }

  try {
    const response = await fetch('https://api.fency.ai/v1/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Fency session API error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 502 },
    )
  }
}
