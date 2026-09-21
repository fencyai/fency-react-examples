import { z } from 'zod'

export const sessionClientTokenSchema = z.object({
  clientToken: z.string(),
})
