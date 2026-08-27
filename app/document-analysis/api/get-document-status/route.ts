import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { documentRepository } from '../../db/documentRepository'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const documentId = new URL(request.url).searchParams.get('documentId')
  if (!documentId) {
    throw new Error('documentId is required.')
  }

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

  return NextResponse.json({
    id: document.id,
    fileName: document.fileName,
    contentStatus: document.contentStatus,
    contentParts: document.contentParts,
  })
}
