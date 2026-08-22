import 'server-only'

import { and, eq, isNotNull, isNull, ne } from 'drizzle-orm'
import { db } from './client'
import {
  exploreMemoriesCars,
  exploreMemoriesMemoryTypes,
} from './schema'

export const DEMO_CAR_MEMORY_TYPE_NAME = 'DemoCar'
export const DEMO_CAR_CATALOG_SIZE = 100
export const DEMO_CAR_TAG_KEY = 'demoCarTag'

export type DemoCarRow = typeof exploreMemoriesCars.$inferSelect

export async function getDemoCarMemoryType() {
  const [row] = await db
    .select()
    .from(exploreMemoriesMemoryTypes)
    .where(eq(exploreMemoriesMemoryTypes.name, DEMO_CAR_MEMORY_TYPE_NAME))
    .limit(1)
  return row ?? null
}

export async function saveDemoCarMemoryType(fencyMemoryTypeId: string) {
  const existing = await getDemoCarMemoryType()
  if (existing) {
    if (existing.fencyMemoryTypeId !== fencyMemoryTypeId) {
      await db
        .update(exploreMemoriesMemoryTypes)
        .set({ fencyMemoryTypeId })
        .where(eq(exploreMemoriesMemoryTypes.id, existing.id))
    }
    return { ...existing, fencyMemoryTypeId }
  }

  const [row] = await db
    .insert(exploreMemoriesMemoryTypes)
    .values({
      name: DEMO_CAR_MEMORY_TYPE_NAME,
      fencyMemoryTypeId,
    })
    .returning()
  return row
}

export async function listUserCars(userId: string, versionTag: string) {
  return db
    .select()
    .from(exploreMemoriesCars)
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        eq(exploreMemoriesCars.versionTag, versionTag),
      ),
    )
}

export async function countSyncedUserCars(userId: string, versionTag: string) {
  const rows = await db
    .select({ id: exploreMemoriesCars.id })
    .from(exploreMemoriesCars)
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        eq(exploreMemoriesCars.versionTag, versionTag),
        isNotNull(exploreMemoriesCars.fencyMemoryId),
      ),
    )
  return rows.length
}

export async function wipeStaleUserCars(userId: string, versionTag: string) {
  await db
    .delete(exploreMemoriesCars)
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        ne(exploreMemoriesCars.versionTag, versionTag),
      ),
    )

  await db
    .delete(exploreMemoriesCars)
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        eq(exploreMemoriesCars.versionTag, versionTag),
        isNull(exploreMemoriesCars.fencyMemoryId),
      ),
    )
}

export async function insertCars(
  cars: Array<{
    userId: string
    identity: string
    versionTag: string
    make: string
    model: string
    year: number
    color: string
    priceUsd: number
    mileageKm: number
    fuelType: string
    transmission: string
    bodyStyle: string
    horsepower: number
    updatedAt: Date
  }>,
) {
  if (cars.length === 0) {
    return
  }

  await db
    .insert(exploreMemoriesCars)
    .values(cars)
    .onConflictDoNothing({
      target: [
        exploreMemoriesCars.userId,
        exploreMemoriesCars.identity,
        exploreMemoriesCars.versionTag,
      ],
    })
}

export async function bumpUnsyncedCarUpdatedAt(
  userId: string,
  versionTag: string,
  updatedAt: Date,
) {
  await db
    .update(exploreMemoriesCars)
    .set({ updatedAt })
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        eq(exploreMemoriesCars.versionTag, versionTag),
        isNull(exploreMemoriesCars.fencyMemoryId),
      ),
    )
}

export async function setCarMemoryIds(
  mappings: Array<{
    identity: string
    versionTag: string
    fencyMemoryId: string
  }>,
) {
  for (const mapping of mappings) {
    await db
      .update(exploreMemoriesCars)
      .set({ fencyMemoryId: mapping.fencyMemoryId })
      .where(
        and(
          eq(exploreMemoriesCars.identity, mapping.identity),
          eq(exploreMemoriesCars.versionTag, mapping.versionTag),
        ),
      )
  }
}

export async function getSyncedCarCatalog(userId: string, versionTag: string) {
  const memoryType = await getDemoCarMemoryType()
  if (!memoryType) {
    return null
  }

  const synced = await countSyncedUserCars(userId, versionTag)
  if (synced < DEMO_CAR_CATALOG_SIZE) {
    return null
  }

  return {
    memoryTypeId: memoryType.fencyMemoryTypeId,
    versionTag,
  }
}
