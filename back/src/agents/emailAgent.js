import { analyzeEmail, planResponse, writeReply, verifyReply } from '../services/emailService.js'


const MAX_ATTEMPTS = 2

async function runStep(trace, name, fn) {
  const start = Date.now()
  try {
    const result = await fn()
    trace.push({ step: name, status: 'ok', ms: Date.now() - start })
    return result
  } catch (err) {
    trace.push({ step: name, status: 'error', ms: Date.now() - start })
    console.error('[agent] échec :', trace)
    throw err
  }
}

export async function prepareReply({ email }) {
  const trace = []

  const analysis = await runStep(trace, 'analyze', () => analyzeEmail(email))
  const plan = await runStep(trace, 'plan', () => planResponse({ email, analysis }))

  const needsUserInput = plan.missingInfo.length > 0

  console.log('[agent] trace :', trace)
  return { analysis, plan, needsUserInput, trace }
}

export async function composeReply({ email, tone, length, plan, answers }) {
  const trace = []
  let draft = ''
  let issues = []
  let attempts = 0

  while (attempts < MAX_ATTEMPTS) {
    attempts++
    const feedback = issues.map((i) => `${i.type} : ${i.detail}`)

    draft = await runStep(trace, `write #${attempts}`, () =>
      writeReply({ email, tone, length, plan, answers, feedback })
    )

    const verification = await runStep(trace, `verify #${attempts}`, () =>
      verifyReply({ email, plan, answers, draft })
    )
    issues = [...verification.issues, ...checkAttachment(draft, plan, answers)]
    if (issues.length) console.log(`[agent] tentative ${attempts} refusée :`, issues.map((i) => i.type))
    if (issues.length === 0) break
  }

  console.log('[agent] trace :', trace)
  return { response: draft, verified: issues.length === 0, issues, attempts, trace }
}

const ATTACHMENT_PATTERN = /ci-joint|pi[eè]ce jointe|en PJ\b/i

function checkAttachment(draft, plan, answers) {
  if (!ATTACHMENT_PATTERN.test(draft)) return []

  const userMentionedIt = plan.missingInfo.some(
    ({ id, question }) => answers[id] && /joindre|joint|pi[eè]ce/i.test(`${question} ${answers[id]}`)
  )
  if (userMentionedIt) return []

  return [{
    type: 'unsupported_claim',
    detail: "La réponse mentionne une pièce jointe alors que l'utilisateur n'a pas indiqué en joindre une.",
  }]
}