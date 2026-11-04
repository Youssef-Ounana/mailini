import { z } from 'zod'
import { generateSchema } from './email.schema.js'
import { planSchema } from './plan.schema.js'

export const replySchema = generateSchema.extend({
  plan: planSchema,
  answers: z
    .record(z.string().max(50), z.string().trim().max(500))
    .refine((a) => Object.keys(a).length <= 10, 'Trop de réponses')
    .default({}),
})