import { z } from 'zod'

export const extractionSchema = z.object({
  name: z.string().describe('Full name of the person'),
  role: z.string().describe('Job title or role'),
  company: z.string().describe('Company or organization'),
  email: z
    .string()
    .describe('Email address if mentioned, otherwise an empty string'),
  summary: z.string().describe('One-sentence summary of the person'),
})

export type Extraction = z.infer<typeof extractionSchema>

export const extractionJsonSchema = JSON.stringify(
  z.toJSONSchema(extractionSchema),
)
