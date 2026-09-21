import { NextResponse } from 'next/server'
import { z } from 'zod'
import { contentStatusSchema } from '../../analyzedDocument'
import { documentRepository } from '../../db/documentRepository'
import { verifyFencySignature } from './verifyFencySignature'

const eventTypeSchema = z.object({
  type: z.string(),
})

const userTestEventSchema = z.object({
  type: z.literal('user.test'),
  message: z.string(),
})

const memoryUpdatedEventSchema = z.object({
  type: z.literal('memory.updated'),
  entity: z.object({
    id: z.string(),
    contentStatus: contentStatusSchema,
    contentParts: z.number().nullable().optional(),
  }),
})

export async function POST(request: Request) {
  const raw = await request.text()
  verifyFencySignature(raw, request.headers.get('x-fency-signature'))

  const body: unknown = JSON.parse(raw)
  const { type } = eventTypeSchema.parse(body)

  if (type === 'user.test') {
    const event = userTestEventSchema.parse(body)
    return NextResponse.json({ ok: true, message: event.message })
  }

  if (type !== 'memory.updated') {
    return NextResponse.json({ ok: true })
  }

  const event = memoryUpdatedEventSchema.parse(body)
  await documentRepository.updateContentStatus(
    event.entity.id,
    event.entity.contentStatus,
    event.entity.contentParts ?? null,
  )

  return NextResponse.json({ ok: true })
}
