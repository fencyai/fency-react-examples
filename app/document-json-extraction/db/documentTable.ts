import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const documentTable = pgTable('document_analysis_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  fencyMemoryId: text('fency_memory_id').notNull().unique(),
  fileName: text('file_name').notNull(),
  contentStatus: text('content_status').notNull(),
  contentParts: integer('content_parts'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
