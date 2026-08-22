import 'server-only'

import { and, eq, isNotNull, isNull } from 'drizzle-orm'
import { db } from './client'
import {
  exploreMemoriesCars,
  exploreMemoriesMemoryTypes,
} from './schema'

export const DEMO_CAR_MEMORY_TYPE_NAME = 'DemoCar'
export const DEMO_CAR_CATALOG_SIZE = 100

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

export async function listUserCars(userId: string) {
  return db
    .select()
    .from(exploreMemoriesCars)
    .where(eq(exploreMemoriesCars.userId, userId))
}

export async function countSyncedUserCars(userId: string) {
  const rows = await db
    .select({ id: exploreMemoriesCars.id })
    .from(exploreMemoriesCars)
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        isNotNull(exploreMemoriesCars.fencyMemoryId),
      ),
    )
  return rows.length
}

export async function insertCars(
  cars: Array<{
    userId: string
    identity: string
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
    .onConflictDoNothing({ target: exploreMemoriesCars.identity })
}

export async function bumpUnsyncedCarUpdatedAt(userId: string, updatedAt: Date) {
  await db
    .update(exploreMemoriesCars)
    .set({ updatedAt })
    .where(
      and(
        eq(exploreMemoriesCars.userId, userId),
        isNull(exploreMemoriesCars.fencyMemoryId),
      ),
    )
}

export async function setCarMemoryIds(
  mappings: Array<{ identity: string; fencyMemoryId: string }>,
) {
  for (const mapping of mappings) {
    await db
      .update(exploreMemoriesCars)
      .set({ fencyMemoryId: mapping.fencyMemoryId })
      .where(eq(exploreMemoriesCars.identity, mapping.identity))
  }
}

export async function getSyncedCarCatalog(userId: string) {
  const memoryType = await getDemoCarMemoryType()
  if (!memoryType) {
    return null
  }

  const cars = await listUserCars(userId)
  const memoryIds = cars
    .map((car) => car.fencyMemoryId)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)

  if (memoryIds.length < DEMO_CAR_CATALOG_SIZE) {
    return null
  }

  return {
    memoryTypeId: memoryType.fencyMemoryTypeId,
    memoryIds,
  }
}
