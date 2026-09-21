import { z } from 'zod'

export const responseSchema = z.object({
  name: z.string().describe('City name'),
  coastal: z.boolean().describe('Whether the city sits on a coast'),
  population: z.number().describe('Approximate population'),
})

export type JsonResponse = z.infer<typeof responseSchema>

export const responseJsonSchema = JSON.stringify(z.toJSONSchema(responseSchema))
