import 'server-only'

import { desc, eq } from 'drizzle-orm'
import { db } from './client'
import {
  exploreConversations,
  exploreQueries,
  type ExploreConversation,
  type ExploreQuery,
} from './schema'

export async function getLatestConversation(): Promise<ExploreConversation | null> {
  const [row] = await db
    .select()
    .from(exploreConversations)
    .orderBy(desc(exploreConversations.createdAt))
    .limit(1)
  return row ?? null
}

export async function getConversation(
  id: string,
): Promise<ExploreConversation | null> {
  const [row] = await db
    .select()
    .from(exploreConversations)
    .where(eq(exploreConversations.id, id))
    .limit(1)
  return row ?? null
}

export async function insertConversation(input: {
  fencyConversationId: string
  title?: string | null
}): Promise<ExploreConversation> {
  const [row] = await db
    .insert(exploreConversations)
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
    .update(exploreConversations)
    .set({ title })
    .where(eq(exploreConversations.id, id))
}

export async function listQueries(
  conversationId: string,
): Promise<ExploreQuery[]> {
  return db
    .select()
    .from(exploreQueries)
    .where(eq(exploreQueries.conversationId, conversationId))
    .orderBy(desc(exploreQueries.createdAt))
}

export async function insertQuery(input: {
  conversationId: string
  query: string
  fencyAgentTaskId?: string | null
}): Promise<ExploreQuery> {
  const [row] = await db
    .insert(exploreQueries)
    .values({
      conversationId: input.conversationId,
      query: input.query,
      fencyAgentTaskId: input.fencyAgentTaskId ?? null,
    })
    .returning()
  return row
}
