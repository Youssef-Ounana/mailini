import { z } from 'zod'

export const MAX_EMAIL_LENGTH = 5000
export const TONES = ['professional', 'formal', 'friendly', 'direct', 'polite']
export const LENGTHS = ['short', 'medium', 'detailed']

export const analyzeSchema = z.object({
  email: z
    .string({ error: "L'email doit être une chaîne de caractères" })
    .trim()
    .min(1, "L'email est requis")
    .max(MAX_EMAIL_LENGTH, `L'email ne doit pas dépasser ${MAX_EMAIL_LENGTH} caractères`),
})

export const generateSchema = analyzeSchema.extend({
  tone: z.enum(TONES, { error: 'Ton invalide' }),
  length: z.enum(LENGTHS, { error: 'Longueur invalide' }),
})