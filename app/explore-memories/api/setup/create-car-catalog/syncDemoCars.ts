import 'server-only'

import {
  DEMO_CAR_CATALOG_SIZE,
  bumpUnsyncedCarUpdatedAt,
  countSyncedUserCars,
  insertCars,
  listUserCars,
  setCarMemoryIds,
  wipeStaleUserCars,
} from '../../../db/queries'
import {
  buildDemoCarCatalog,
  catalogIdentityFromMemoryId,
  demoCarMetadata,
  demoCarTitle,
} from './carCatalog'
import { createFencyMemoryBulkJob } from './createFencyMemoryBulkJob'
import { getFencyMemory } from './getFencyMemory'
import { getFencyMemoryBulkJob } from './getFencyMemoryBulkJob'

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function mapMemoryIds(memoryIds: string[], versionTag: string) {
  const mappings: Array<{
    identity: string
    versionTag: string
    fencyMemoryId: string
  }> = []

  for (const chunk of chunkItems(memoryIds, 10)) {
    const pages = await Promise.all(chunk.map((id) => getFencyMemory(id)))
    for (const page of pages) {
      if (!page.ok || typeof page.data.id !== 'string') {
        continue
      }
      const taggedId = page.data.metadata?.id
      if (typeof taggedId !== 'string') {
        continue
      }
      const identity = catalogIdentityFromMemoryId(versionTag, taggedId)
      if (identity) {
        mappings.push({
          identity,
          versionTag,
          fencyMemoryId: page.data.id,
        })
      }
    }
  }

  if (mappings.length > 0) {
    await setCarMemoryIds(mappings)
  }
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

export async function syncDemoCars(
  userId: string,
  memoryTypeId: string,
  versionTag: string,
) {
  await wipeStaleUserCars(userId, versionTag)

  const updatedAt = new Date()
  const catalog = buildDemoCarCatalog(userId, versionTag, updatedAt)
  await insertCars(catalog)

  if ((await countSyncedUserCars(userId, versionTag)) >= DEMO_CAR_CATALOG_SIZE) {
    return
  }

  await bumpUnsyncedCarUpdatedAt(userId, versionTag, updatedAt)
  const cars = await listUserCars(userId, versionTag)
  const unsynced = cars.filter((car) => !car.fencyMemoryId)
  const toSync = unsynced.length > 0 ? unsynced : cars

  const job = await createFencyMemoryBulkJob({
    memoryTypeId,
    memories: toSync.map((car) => ({
      title: demoCarTitle({
        ...car,
        updatedAt: car.updatedAt,
      }),
      metadata: demoCarMetadata({
        ...car,
        updatedAt: car.updatedAt,
      }),
    })),
  })

  if (!job.ok || typeof job.data.jobId !== 'string') {
    throw new Error(
      job.data.error?.message ?? 'Failed to start the DemoCar memory sync.',
    )
  }

  let created: string[] = []
  let updated: string[] = []
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const status = await getFencyMemoryBulkJob(job.data.jobId)
    if (!status.ok) {
      throw new Error('Failed to poll the DemoCar memory sync.')
    }
    if (status.data.status === 'FAILED') {
      throw new Error(
        status.data.errorMessage ?? 'DemoCar memory sync failed in Fency.',
      )
    }
    if (
      status.data.status === 'COMPLETED' ||
      status.data.status === 'COMPLETE'
    ) {
      created = status.data.result?.created ?? []
      updated = status.data.result?.updated ?? []
      break
    }
    if (attempt === 59) {
      throw new Error('Timed out waiting for the DemoCar memory sync.')
    }
    await sleep(500)
  }

  await mapMemoryIds([...created, ...updated], versionTag)

  if ((await countSyncedUserCars(userId, versionTag)) < DEMO_CAR_CATALOG_SIZE) {
    throw new Error('DemoCar rows were not all assigned a Fency memory id.')
  }
}
