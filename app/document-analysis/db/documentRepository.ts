import 'server-only'

import { desc, eq } from 'drizzle-orm'
import { db } from './client'
import { documentTable } from './documentTable'

export type DocumentRow = typeof documentTable.$inferSelect

export const documentRepository = {
  async insert(values: {
    userId: string
    fencyMemoryId: string
    fileName: string
    contentStatus: string
  }) {
    const [row] = await db.insert(documentTable).values(values).returning()
    return row
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id))
      .limit(1)
    return row ?? null
  },

  async findByFencyMemoryId(fencyMemoryId: string) {
    const [row] = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.fencyMemoryId, fencyMemoryId))
      .limit(1)
    return row ?? null
  },

  async listByUser(userId: string) {
    return db
      .select()
      .from(documentTable)
      .where(eq(documentTable.userId, userId))
      .orderBy(desc(documentTable.createdAt))
  },

  async updateContentStatus(
    fencyMemoryId: string,
    contentStatus: string,
    contentParts: number | null,
  ) {
    const [row] = await db
      .update(documentTable)
      .set({
        contentStatus,
        contentParts,
        updatedAt: new Date(),
      })
      .where(eq(documentTable.fencyMemoryId, fencyMemoryId))
      .returning()
    return row ?? null
  },
}
