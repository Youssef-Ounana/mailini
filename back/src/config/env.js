import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  LLM_API_KEY: z.string().min(1, 'La clé API du LLM est requise'),
  LLM_BASE_URL: z.url().optional(),
  LLM_MODEL: z.string().min(1, 'Le nom du modèle est requis'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Configuration invalide :')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')} : ${issue.message}`)
  }
  process.exit(1)
}

export const env = parsed.data