import 'server-only'

import { desc, eq } from 'drizzle-orm'
import { db } from './client'
import {
  streamingConversations,
  streamingMessages,
  type StreamingConversation,
  type StreamingMessage,
} from './schema'

export async function getLatestConversation(): Promise<StreamingConversation | null> {
  const [row] = await db
    .select()
    .from(streamingConversations)
    .orderBy(desc(streamingConversations.createdAt))
    .limit(1)
  return row ?? null
}

export async function getConversation(
  id: string,
): Promise<StreamingConversation | null> {
  const [row] = await db
    .select()
    .from(streamingConversations)
    .where(eq(streamingConversations.id, id))
    .limit(1)
  return row ?? null
}

export async function insertConversation(input: {
  fencyConversationId: string
  title?: string | null
}): Promise<StreamingConversation> {
  const [row] = await db
    .insert(streamingConversations)
    .values({
      fencyConversationId: input.fencyConversationId,
      title: input.title ?? null,
    })
    .returning()
  return row
}

export async function updateConversationTitle(
  id: string,
  title: string,
): Promise<void> {
  await db
    .update(streamingConversations)
    .set({ title })
    .where(eq(streamingConversations.id, id))
}

export async function listMessages(
  conversationId: string,
): Promise<StreamingMessage[]> {
  return db
    .select()
    .from(streamingMessages)
    .where(eq(streamingMessages.conversationId, conversationId))
    .orderBy(streamingMessages.createdAt)
}

export async function insertMessages(
  conversationId: string,
  messages: Array<{
    role: string
    content: string
    fencyAgentTaskId?: string | null
  }>,
): Promise<StreamingMessage[]> {
  if (messages.length === 0) {
    return []
  }
  return db
    .insert(streamingMessages)
    .values(
      messages.map((message) => ({
        conversationId,
        role: message.role,
        content: message.content,
        fencyAgentTaskId: message.fencyAgentTaskId ?? null,
      })),
    )
    .returning()
}
