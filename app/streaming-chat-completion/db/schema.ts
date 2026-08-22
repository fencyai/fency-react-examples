import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const streamingConversations = pgTable('streaming_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fencyConversationId: text('fency_conversation_id').notNull().unique(),
  title: text('title'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const streamingMessages = pgTable('streaming_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => streamingConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  fencyAgentTaskId: text('fency_agent_task_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type StreamingConversation = typeof streamingConversations.$inferSelect
export type StreamingMessage = typeof streamingMessages.$inferSelect
