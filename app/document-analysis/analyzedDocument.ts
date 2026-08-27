import { z } from 'zod'

export const contentStatuses = [
  'EMPTY',
  'SYNCHRONIZING',
  'SYNCHRONIZED',
  'SYNCHRONIZATION_ERROR',
] as const

export type ContentStatus = (typeof contentStatuses)[number]

export const contentStatusSchema = z.enum(contentStatuses)

export const analyzedDocumentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  contentStatus: contentStatusSchema,
  contentParts: z.number().nullable(),
})

export type AnalyzedDocument = z.infer<typeof analyzedDocumentSchema>
