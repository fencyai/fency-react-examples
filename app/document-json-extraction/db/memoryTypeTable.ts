import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const memoryTypeTable = pgTable('document_analysis_memory_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  fencyMemoryTypeId: text('fency_memory_type_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
