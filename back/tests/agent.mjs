import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const API = 'http://localhost:3001/api/email'
const [fixture = 'devis', tone = 'professional', length = 'medium'] = process.argv.slice(2)

async function post(path, body) {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(data.error)}`)
  return data
}

const { email } = JSON.parse(await readFile(new URL(`./fixtures/${fixture}.json`, import.meta.url), 'utf8'))

console.log('\n1. Planification…')
const { plan, needsUserInput } = await post('plan', { email })
plan.requests.forEach((r) => console.log(`   - ${r.request} [${r.handling}]`))

const answers = {}
if (needsUserInput) {
  console.log('\n2. Questions (Entrée pour passer) :')
  const rl = createInterface({ input, output })
  for (const { id, question } of plan.missingInfo) {
    const answer = (await rl.question(`   ${question}\n   > `)).trim()
    if (answer) answers[id] = answer
  }
  rl.close()
}

console.log('\n3. Rédaction et vérification…')
const result = await post('reply', { email, tone, length, plan, answers })

console.log('\n---------- Réponse ----------\n' + result.response + '\n-----------------------------')
console.log(`Vérifiée : ${result.verified} | tentatives : ${result.attempts}`)
if (result.issues.length) console.log('Problèmes restants :', result.issues)
console.log('Trace :', result.trace.map((s) => `${s.step} ${s.status} ${s.ms}ms`).join(' → '))