import 'server-only'

import type { z } from 'zod'

export function fencySecretKey() {
  const secretKey = process.env.FENCY_SECRET_KEY
  if (!secretKey) {
    throw new Error('FENCY_SECRET_KEY is not defined.')
  }
  return secretKey
}

export async function fencyJson<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
) {
  const response = await fetch(`https://api.fency.ai${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${fencySecretKey()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })
  const data = schema.parse(await response.json())
  return { ok: response.ok, status: response.status, data }
}
