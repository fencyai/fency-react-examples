import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import {
  DOCUMENT_TAG_KEY,
  DOCUMENT_TAG_VALUE,
} from '../../documentAnalysisConstants'
import { documentRepository } from '../../db/documentRepository'
import { createFencyFileMemory } from './createFencyFileMemory'
import { createFencyMemoryUpload } from './createFencyMemoryUpload'
import { ensureDocumentMemoryType } from './ensureDocumentMemoryType'
import { uploadFileToS3 } from './uploadFileToS3'

export async function POST(request: Request) {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new Error('Expected a file field named file.')
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Upload a PDF file.' },
      { status: 400 },
    )
  }

  const memoryTypeId = await ensureDocumentMemoryType()
  const memory = await createFencyFileMemory({
    memoryTypeId,
    title: file.name,
    metadata: {
      userId,
      [DOCUMENT_TAG_KEY]: DOCUMENT_TAG_VALUE,
    },
  })
  const awsS3PostRequest = await createFencyMemoryUpload(memory.id, {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  })
  await uploadFileToS3(awsS3PostRequest, file)

  const document = await documentRepository.insert({
    userId,
    fencyMemoryId: memory.id,
    fileName: file.name,
    contentStatus: 'EMPTY',
  })

  return NextResponse.json({
    id: document.id,
    fileName: document.fileName,
    contentStatus: document.contentStatus,
    contentParts: document.contentParts,
  })
}
