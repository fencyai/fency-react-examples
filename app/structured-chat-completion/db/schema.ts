import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const structuredConversations = pgTable('structured_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fencyConversationId: text('fency_conversation_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const structuredExtractions = pgTable('structured_extractions', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => structuredConversations.id, { onDelete: 'cascade' }),
  fencyAgentTaskId: text('fency_agent_task_id'),
  inputText: text('input_text').notNull(),
  result: jsonb('result').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type StructuredConversation = typeof structuredConversations.$inferSelect
export type StructuredExtraction = typeof structuredExtractions.$inferSelect
