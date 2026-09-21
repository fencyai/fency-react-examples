import 'server-only'

import { DOCUMENT_MEMORY_TYPE_NAME } from '../../documentAnalysisConstants'
import { memoryTypeRepository } from '../../db/memoryTypeRepository'
import { createFencyMemoryType } from './createFencyMemoryType'
import { listFencyMemoryTypes } from './listFencyMemoryTypes'

export async function ensureDocumentMemoryType() {
  const stored = await memoryTypeRepository.findByName(
    DOCUMENT_MEMORY_TYPE_NAME,
  )
  if (stored) {
    return stored.fencyMemoryTypeId
  }

  const created = await createFencyMemoryType({
    name: DOCUMENT_MEMORY_TYPE_NAME,
    description: 'Uploaded PDFs for Document analysis.',
    type: 'SEMANTIC',
  })

  if (created.ok && typeof created.data.id === 'string') {
    await memoryTypeRepository.save(
      DOCUMENT_MEMORY_TYPE_NAME,
      created.data.id,
    )
    return created.data.id
  }

  const listed = await listFencyMemoryTypes()
  const existing = listed.items.find(
    (item) => item.name === DOCUMENT_MEMORY_TYPE_NAME,
  )
  if (!existing) {
    throw new Error(
      created.data.error?.message ??
        'Failed to create the AnalyzedDocument memory type.',
    )
  }

  await memoryTypeRepository.save(DOCUMENT_MEMORY_TYPE_NAME, existing.id)
  return existing.id
}
