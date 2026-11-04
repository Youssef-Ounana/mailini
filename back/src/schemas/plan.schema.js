import { z } from 'zod'
import { TONES } from './email.schema.js'

export const planSchema = z.object({
  requests: z
    .array(
      z.object({
        request: z.string().describe("Une demande ou question de l'expéditeur, reformulée simplement"),
        handling: z
          .enum(['answer', 'needs_user_input', 'acknowledge'])
          .describe(
            "answer : on peut y répondre avec les informations disponibles ; needs_user_input : il faut une information ou une décision de l'utilisateur ; acknowledge : il suffit d'en prendre acte"
          ),
      })
    )
    .describe("Toutes les demandes et questions de l'expéditeur, sans en oublier"),
  missingInfo: z
    .array(
      z.object({
        id: z.string().describe('Identifiant court en snake_case, par exemple montant_devis'),
        question: z.string().describe("Question courte et précise à poser à l'utilisateur, en français"),
      })
    )
    .describe("Informations ou décisions nécessaires pour répondre. Liste vide si rien ne manque."),
  replyGoal: z.string().describe('Objectif de la réponse, en une phrase'),
  outline: z.array(z.string()).describe('Les idées à exprimer dans la réponse, dans l\'ordre'),
  suggestedTone: z.enum(TONES).describe('Le ton le plus adapté pour répondre à cet email'),
})