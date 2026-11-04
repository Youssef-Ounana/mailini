import * as emailService from '../services/emailService.js'
import { prepareReply, composeReply } from '../agents/emailAgent.js'




export async function analyze(req, res) {
  const analysis = await emailService.analyzeEmail(req.body.email)
  res.json({ analysis })
}

export async function generate(req, res) {
  const { email, tone, length } = req.body
  const response = await emailService.generateResponse({ email, tone, length })
  res.json({ response })
}

export async function plan(req, res) {
  const result = await prepareReply({ email: req.body.email })
  res.json(result)
}

export async function reply(req, res) {
  const { email, tone, length, plan, answers } = req.body
  const result = await composeReply({ email, tone, length, plan, answers })
  res.json(result)
}