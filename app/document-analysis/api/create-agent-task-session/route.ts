import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthorizedUserId } from '../../../auth'
import { DOCUMENT_MEMORY_TYPE_NAME } from '../../documentAnalysisConstants'
import { documentRepository } from '../../db/documentRepository'
import { memoryTypeRepository } from '../../db/memoryTypeRepository'
import { buildDocumentGuardRails } from './buildDocumentGuardRails'

const bodySchema = z.object({
  documentId: z.string(),
})

export async function POST(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { documentId } = bodySchema.parse(await request.json())
  const document = await documentRepository.findById(documentId)
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }
  if (document.userId !== userId) {
    return NextResponse.json(
      { error: 'Document does not belong to this user' },
      { status: 403 },
    )
  }
  if (document.contentStatus !== 'SYNCHRONIZED') {
    return NextResponse.json(
      { error: 'Document is not synchronized yet.' },
      { status: 409 },
    )
  }

  const memoryType = await memoryTypeRepository.findByName(
    DOCUMENT_MEMORY_TYPE_NAME,
  )
  if (!memoryType) {
    throw new Error('AnalyzedDocument memory type is not set up.')
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
        taskType: 'MEMORY_SEARCH',
        metadata: { userId },
        guardRails: buildDocumentGuardRails(
          memoryType.fencyMemoryTypeId,
          document.fencyMemoryId,
        ),
      },
    }),
  })
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
