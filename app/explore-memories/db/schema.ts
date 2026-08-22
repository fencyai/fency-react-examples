import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const exploreConversations = pgTable('explore_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fencyConversationId: text('fency_conversation_id').notNull().unique(),
  title: text('title'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const exploreQueries = pgTable('explore_queries', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => exploreConversations.id, { onDelete: 'cascade' }),
  query: text('query').notNull(),
  fencyAgentTaskId: text('fency_agent_task_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type ExploreConversation = typeof exploreConversations.$inferSelect
export type ExploreQuery = typeof exploreQueries.$inferSelect
