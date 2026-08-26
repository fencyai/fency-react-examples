import 'server-only'

import {
  DEMO_CAR_MEMORY_TYPE_NAME,
  getDemoCarMemoryType,
  saveDemoCarMemoryType,
} from '../../../db/queries'
import { createFencyMemoryType } from './createFencyMemoryType'
import { listFencyMemoryTypes } from './listFencyMemoryTypes'

export async function ensureDemoCarMemoryType() {
  const stored = await getDemoCarMemoryType()
  if (stored) {
    return stored.fencyMemoryTypeId
  }

  const created = await createFencyMemoryType({
    name: DEMO_CAR_MEMORY_TYPE_NAME,
    description: 'Demo vehicle catalog for Explore Memories.',
    type: 'METADATA',
    identityKeyName: 'id',
    updatedAtKeyName: 'updated_at',
  })

  if (created.ok && typeof created.data.id === 'string') {
    await saveDemoCarMemoryType(created.data.id)
    return created.data.id
  }

  const listed = await listFencyMemoryTypes()
  const existing = listed.items.find(
    (item) => item.name === DEMO_CAR_MEMORY_TYPE_NAME,
  )
  if (!existing) {
    throw new Error(
      created.data.error?.message ??
        'Failed to create the DemoCar memory type.',
    )
  }

  await saveDemoCarMemoryType(existing.id)
  return existing.id
}
