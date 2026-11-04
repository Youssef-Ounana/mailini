import { z } from 'zod'

export const analysisSchema = z.object({
  subject: z.string().describe("Sujet de l'email en quelques mots"),
  intent: z.string().describe("Ce que l'expéditeur cherche à obtenir, en une phrase courte"),
  tone: z.string().describe("Ton employé par l'expéditeur (ex. : poli, pressant, agacé)"),
  urgency: z.enum(['low', 'medium', 'high']).describe("Niveau d'urgence de la réponse attendue"),
  summary: z.string().describe("Résumé de l'email en une ou deux phrases"),
  keyPoints: z
    .array(z.string())
    .describe('Informations importantes présentes dans l\'email : dates, demandes, montants, échéances'),
})