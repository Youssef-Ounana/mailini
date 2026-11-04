async function request(path, body) {
  let res
  try {
    res = await fetch(`/api/email/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error?.message ?? 'Le serveur ne répond pas correctement. Réessayez plus tard.')
  }

  return data
}

export async function analyzeEmail(email) {
  const { analysis } = await request('analyze', { email })
  return analysis
}

export async function generateResponse({ email, tone, length }) {
  const { response } = await request('generate', { email, tone, length })
  return response
}

export function planReply(email) {
  return request('plan', { email })
}

export function composeReply({ email, tone, length, plan, answers }) {
  return request('reply', { email, tone, length, plan, answers })
}