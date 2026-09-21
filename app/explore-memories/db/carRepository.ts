import 'server-only'

import { and, eq, isNotNull, isNull, ne } from 'drizzle-orm'
import { db } from './client'
import { carTable } from './carTable'

type NewCar = {
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
}

export const carRepository = {
  async listByUser(userId: string, versionTag: string) {
    return db
      .select()
      .from(carTable)
      .where(
        and(
          eq(carTable.userId, userId),
          eq(carTable.versionTag, versionTag),
        ),
      )
  },

  async countSynced(userId: string, versionTag: string) {
    const rows = await db
      .select({ id: carTable.id })
      .from(carTable)
      .where(
        and(
          eq(carTable.userId, userId),
          eq(carTable.versionTag, versionTag),
          isNotNull(carTable.fencyMemoryId),
        ),
      )
    return rows.length
  },

  async deleteStale(userId: string, versionTag: string) {
    await db
      .delete(carTable)
      .where(
        and(
          eq(carTable.userId, userId),
          ne(carTable.versionTag, versionTag),
        ),
      )

    await db
      .delete(carTable)
      .where(
        and(
          eq(carTable.userId, userId),
          eq(carTable.versionTag, versionTag),
          isNull(carTable.fencyMemoryId),
        ),
      )
  },

  async insertMany(cars: NewCar[]) {
    if (cars.length === 0) {
      return
    }

    await db
      .insert(carTable)
      .values(cars)
      .onConflictDoNothing({
        target: [
          carTable.userId,
          carTable.identity,
          carTable.versionTag,
        ],
      })
  },

  async touchUnsynced(userId: string, versionTag: string, updatedAt: Date) {
    await db
      .update(carTable)
      .set({ updatedAt })
      .where(
        and(
          eq(carTable.userId, userId),
          eq(carTable.versionTag, versionTag),
          isNull(carTable.fencyMemoryId),
        ),
      )
  },

  async assignMemoryIds(
    mappings: Array<{
      identity: string
      versionTag: string
      fencyMemoryId: string
    }>,
  ) {
    for (const mapping of mappings) {
      await db
        .update(carTable)
        .set({ fencyMemoryId: mapping.fencyMemoryId })
        .where(
          and(
            eq(carTable.identity, mapping.identity),
            eq(carTable.versionTag, mapping.versionTag),
          ),
        )
    }
  },
}
