import 'server-only'

import {
  DEMO_CAR_CATALOG_SIZE,
  DEMO_CAR_MEMORY_TYPE_NAME,
} from '../../demoCarConstants'
import { carRepository } from '../../db/carRepository'
import { memoryTypeRepository } from '../../db/memoryTypeRepository'

export async function getSyncedCarCatalog(userId: string, versionTag: string) {
  const memoryType = await memoryTypeRepository.findByName(
    DEMO_CAR_MEMORY_TYPE_NAME,
  )
  if (!memoryType) {
    return null
  }

  const synced = await carRepository.countSynced(userId, versionTag)
  if (synced < DEMO_CAR_CATALOG_SIZE) {
    return null
  }

  return {
    memoryTypeId: memoryType.fencyMemoryTypeId,
    versionTag,
  }
}
