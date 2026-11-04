import { complete, completeJSON } from './llm/llmClient.js'
import { buildGenerateReplyPrompt } from '../prompts/generateReply.prompt.js'
import { buildAnalyzePrompt } from '../prompts/analyzeEmail.prompt.js'
import { buildPlanPrompt } from '../prompts/planReply.prompt.js'
import { analysisSchema } from '../schemas/analysis.schema.js'
import { planSchema } from '../schemas/plan.schema.js'
import { buildWritePrompt } from '../prompts/writeReply.prompt.js'
import { buildVerifyPrompt } from '../prompts/verifyReply.prompt.js'
import { verificationSchema } from '../schemas/verification.schema.js'


export async function planResponse({ email, analysis }) {
  const { system, user } = buildPlanPrompt({ email, analysis })
  return completeJSON({ system, user, schema: planSchema, name: 'reply_plan' })
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function analyzeEmail(email) {
  const { system, user } = buildAnalyzePrompt({ email })
  return completeJSON({ system, user, schema: analysisSchema, name: 'email_analysis' })
}

export async function generateResponse({ email, tone, length }) {
  const { system, user } = buildGenerateReplyPrompt({ email, tone, length })
  return complete({ system, user })
}

export async function writeReply({ email, tone, length, plan, answers, feedback }) {
  const { system, user } = buildWritePrompt({ email, tone, length, plan, answers, feedback })
  return complete({ system, user })
}

export async function verifyReply({ email, plan, answers, draft }) {
  const { system, user } = buildVerifyPrompt({ email, plan, answers, draft })
  return completeJSON({ system, user, schema: verificationSchema, name: 'reply_verification' })
}