import 'server-only'

import { and, eq, isNotNull, isNull, ne } from 'drizzle-orm'
import { db } from './client'
import { catTable } from './catTable'

export type CarRow = typeof catTable.$inferSelect

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
      .from(catTable)
      .where(
        and(
          eq(catTable.userId, userId),
          eq(catTable.versionTag, versionTag),
        ),
      )
  },

  async countSynced(userId: string, versionTag: string) {
    const rows = await db
      .select({ id: catTable.id })
      .from(catTable)
      .where(
        and(
          eq(catTable.userId, userId),
          eq(catTable.versionTag, versionTag),
          isNotNull(catTable.fencyMemoryId),
        ),
      )
    return rows.length
  },

  async deleteStale(userId: string, versionTag: string) {
    await db
      .delete(catTable)
      .where(
        and(
          eq(catTable.userId, userId),
          ne(catTable.versionTag, versionTag),
        ),
      )

    await db
      .delete(catTable)
      .where(
        and(
          eq(catTable.userId, userId),
          eq(catTable.versionTag, versionTag),
          isNull(catTable.fencyMemoryId),
        ),
      )
  },

  async insertMany(cars: NewCar[]) {
    if (cars.length === 0) {
      return
    }

    await db
      .insert(catTable)
      .values(cars)
      .onConflictDoNothing({
        target: [
          catTable.userId,
          catTable.identity,
          catTable.versionTag,
        ],
      })
  },

  async touchUnsynced(userId: string, versionTag: string, updatedAt: Date) {
    await db
      .update(catTable)
      .set({ updatedAt })
      .where(
        and(
          eq(catTable.userId, userId),
          eq(catTable.versionTag, versionTag),
          isNull(catTable.fencyMemoryId),
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
        .update(catTable)
        .set({ fencyMemoryId: mapping.fencyMemoryId })
        .where(
          and(
            eq(catTable.identity, mapping.identity),
            eq(catTable.versionTag, mapping.versionTag),
          ),
        )
    }
  },
}
