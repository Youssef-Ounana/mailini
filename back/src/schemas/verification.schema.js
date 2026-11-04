import { z } from 'zod'

export const verificationSchema = z.object({
  issues: z
    .array(
      z.object({
        type: z
          .enum(['missing_request', 'unsupported_claim', 'contradiction', 'tone'])
          .describe('Catégorie du problème'),
        detail: z.string().describe('Description précise du problème, en français'),
      })
    )
    .describe('Problèmes trouvés. Liste vide si la réponse est correcte.'),
})