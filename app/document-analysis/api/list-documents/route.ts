import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import { documentRepository } from '../../db/documentRepository'

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const documents = await documentRepository.listByUser(userId)
  return NextResponse.json({
    documents: documents.map((document) => ({
      id: document.id,
      fileName: document.fileName,
      contentStatus: document.contentStatus,
      contentParts: document.contentParts,
    })),
  })
}
