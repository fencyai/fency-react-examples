import 'server-only'

import { desc, eq } from 'drizzle-orm'
import { db } from './client'
import {
  structuredConversations,
  structuredExtractions,
  type StructuredConversation,
  type StructuredExtraction,
} from './schema'

export async function getLatestConversation(): Promise<StructuredConversation | null> {
  const [row] = await db
    .select()
    .from(structuredConversations)
    .orderBy(desc(structuredConversations.createdAt))
    .limit(1)
  return row ?? null
}

export async function getConversation(
  id: string,
): Promise<StructuredConversation | null> {
  const [row] = await db
    .select()
    .from(structuredConversations)
    .where(eq(structuredConversations.id, id))
    .limit(1)
  return row ?? null
}

export async function insertConversation(input: {
  fencyConversationId: string
}): Promise<StructuredConversation> {
  const [row] = await db
    .insert(structuredConversations)
    .values({ fencyConversationId: input.fencyConversationId })
    .returning()
  return row
}

export async function listExtractions(
  conversationId: string,
): Promise<StructuredExtraction[]> {
  return db
    .select()
    .from(structuredExtractions)
    .where(eq(structuredExtractions.conversationId, conversationId))
    .orderBy(desc(structuredExtractions.createdAt))
}

export async function insertExtraction(input: {
  conversationId: string
  fencyAgentTaskId?: string | null
  inputText: string
  result: Record<string, unknown>
}): Promise<StructuredExtraction> {
  const [row] = await db
    .insert(structuredExtractions)
    .values({
      conversationId: input.conversationId,
      fencyAgentTaskId: input.fencyAgentTaskId ?? null,
      inputText: input.inputText,
      result: input.result,
    })
    .returning()
  return row
}
