import OpenAI from 'openai'
import { env } from '../../config/env.js'
import { AppError } from '../../utils/AppError.js'
import { z } from 'zod'

const client = new OpenAI({
  apiKey: env.LLM_API_KEY,
  baseURL: env.LLM_BASE_URL,
  timeout: 20_000,
    maxRetries: 1,
})

export async function complete({ system, user, responseFormat }) {
  try {
    const completion = await client.chat.completions.create({
      model: env.LLM_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
       ...(responseFormat && { response_format: responseFormat }),
    })

    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      throw new AppError(502, 'LLM_EMPTY_RESPONSE', "L'IA n'a pas renvoyé de réponse. Réessayez.")
    }

    if (env.NODE_ENV === 'development') {
      console.log('[llm] tokens :', completion.usage)
    }

    return text
  } catch (err) {
    throw toAppError(err)
  }
}

function toAppError(err) {
  if (err instanceof AppError) return err

  if (err instanceof OpenAI.APIConnectionTimeoutError) {
    return new AppError(504, 'LLM_TIMEOUT', "L'IA a mis trop de temps à répondre. Réessayez.")
  }

  if (err instanceof OpenAI.APIError) {
    console.error(`[llm] erreur ${err.status ?? 'réseau'} : ${err.message}`)

    if (err.status === 429 || err.status === 503) {
      return new AppError(503, 'LLM_BUSY', "Le service d'IA est saturé. Réessayez dans un instant.")
    }
    if (err.status === 401 || err.status === 403) {
      return new AppError(500, 'LLM_CONFIG', "Le service d'IA est mal configuré.")
    }
    return new AppError(502, 'LLM_ERROR', "Le service d'IA a renvoyé une erreur.")
  }

  return err
}

export async function completeJSON({ system, user, schema, name }) {
  const { $schema, ...jsonSchema } = z.toJSONSchema(schema)

  const text = await complete({
    system,
    user,
    responseFormat: {
      type: 'json_schema',
      json_schema: { name, schema: jsonSchema, strict: true },
    },
  })

  let data
  try {
    data = JSON.parse(text)
  } catch {
    console.error('[llm] réponse non JSON reçue')
    throw new AppError(502, 'LLM_INVALID_JSON', "L'IA a renvoyé une réponse illisible. Réessayez.")
  }

  const result = schema.safeParse(data)
  if (!result.success) {
    console.error('[llm] JSON hors schéma :', result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`))
    throw new AppError(502, 'LLM_INVALID_OUTPUT', "L'IA a renvoyé une analyse invalide. Réessayez.")
  }

  return result.data
}