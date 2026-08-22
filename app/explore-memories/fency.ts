import 'server-only'

import { NextResponse } from 'next/server'

const FENCY_API_BASE_URL = 'https://api.fency.ai'

function requireSecretKey() {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }
  return secretKey
}

export async function fencyFetch(path: string, init?: RequestInit) {
  const secretKey = requireSecretKey()
  return fetch(`${FENCY_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
}

export async function createSession(body: Record<string, unknown>) {
  try {
    const response = await fencyFetch('/v1/sessions', {
      method: 'POST',
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
