import 'server-only'

import { eq } from 'drizzle-orm'
import { db } from './client'
import { memoryTypeTable } from './memoryTypeTable'

export const memoryTypeRepository = {
  async findByName(name: string) {
    const [row] = await db
      .select()
      .from(memoryTypeTable)
      .where(eq(memoryTypeTable.name, name))
      .limit(1)
    return row ?? null
  },

  async save(name: string, fencyMemoryTypeId: string) {
    const existing = await memoryTypeRepository.findByName(name)
    if (existing) {
      if (existing.fencyMemoryTypeId !== fencyMemoryTypeId) {
        await db
          .update(memoryTypeTable)
          .set({ fencyMemoryTypeId })
          .where(eq(memoryTypeTable.id, existing.id))
      }
      return { ...existing, fencyMemoryTypeId }
    }

    const [row] = await db
      .insert(memoryTypeTable)
      .values({
        name,
        fencyMemoryTypeId,
      })
      .returning()
    return row
  },
}
