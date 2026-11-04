import { useState } from 'react'
import { ScanSearch, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import OptionGroup from '../components/ui/OptionGroup'
import EmailInput from '../components/email/EmailInput'
import AnalysisPanel from '../components/email/AnalysisPanel'
import ResponseEditor from '../components/email/ResponseEditor'
import QuestionsPanel from '../components/email/QuestionsPanel'
import AgentProgress from '../components/email/AgentProgress'
import VerificationBadge from '../components/email/VerificationBadge'
import { LENGTHS, MAX_EMAIL_LENGTH, TONES } from '../constants/options'
import { analyzeEmail, composeReply, planReply } from '../services/emailService'

export default function ComposePage() {
  const [email, setEmail] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [analysis, setAnalysis] = useState(null)
  const [plan, setPlan] = useState(null)
  const [answers, setAnswers] = useState({})
  const [response, setResponse] = useState(null)
  const [verification, setVerification] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'analyzing' | 'planning' | 'writing'
  const [error, setError] = useState(null)

  const trimmed = email.trim()
  const canSubmit = trimmed.length > 0 && email.length <= MAX_EMAIL_LENGTH && status === 'idle'

  const agentStep =
    status === 'planning' ? 'plan'
    : status === 'writing' ? 'write'
    : response !== null ? 'done'
    : plan ? 'input'
    : null

  function handleEmailChange(value) {
    setEmail(value)
    setAnalysis(null)
    setPlan(null)
    setAnswers({})
  }

  async function runAction(nextStatus, action) {
    setStatus(nextStatus)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setStatus('idle')
    }
  }

  async function write(currentPlan, currentAnswers) {
    setStatus('writing')
    const result = await composeReply({ email: trimmed, tone, length, plan: currentPlan, answers: currentAnswers })
    setResponse(result.response)
    setVerification({ verified: result.verified, issues: result.issues })
  }

  const handleAnalyze = () =>
    runAction('analyzing', async () => setAnalysis(await analyzeEmail(trimmed)))

  const handlePrepare = () =>
    runAction('planning', async () => {
      setPlan(null)
      setAnswers({})
      setResponse(null)
      setVerification(null)

      const result = await planReply(trimmed)
      setAnalysis(result.analysis)
      setPlan(result.plan)

      if (!result.needsUserInput) await write(result.plan, {})
    })

  const handleWrite = () => runAction('writing', () => write(plan, answers))

  const handleAnswerChange = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const showQuestions = plan && response === null && status !== 'writing'

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Nouvelle réponse</h1>
        <p className="mt-1 text-sm text-slate-500">
          Collez un email : l'agent l'analyse, vous pose les questions utiles, puis rédige et vérifie la réponse.
        </p>
      </div>

      {error && <Alert message={error} onClose={() => setError(null)} />}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card title="Email reçu" description="Le texte de l'email auquel vous souhaitez répondre">
            <EmailInput value={email} onChange={handleEmailChange} />
          </Card>

          <Card title="Paramètres de réponse">
            <div className="space-y-5">
              <OptionGroup label="Ton" options={TONES} value={tone} onChange={setTone} />
              <OptionGroup label="Longueur" options={LENGTHS} value={length} onChange={setLength} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                icon={ScanSearch}
                onClick={handleAnalyze}
                disabled={!canSubmit}
                loading={status === 'analyzing'}
              >
                Analyser
              </Button>
              <Button
                icon={Sparkles}
                onClick={handlePrepare}
                disabled={!canSubmit}
                loading={status === 'planning' || status === 'writing'}
              >
                Préparer la réponse
              </Button>
            </div>
          </Card>

          {showQuestions && (
            <Card title="Informations nécessaires" description="Vos réponses guident la rédaction">
              <QuestionsPanel
                plan={plan}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleWrite}
                currentTone={tone}
                onApplyTone={setTone}
                disabled={status !== 'idle'}
              />
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          {agentStep && (
            <Card>
              <AgentProgress current={agentStep} />
            </Card>
          )}
          <Card title="Analyse">
            <AnalysisPanel analysis={analysis} />
          </Card>
          <Card
            title="Réponse"
            description="Modifiable avant utilisation"
            action={<VerificationBadge verification={verification} />}
          >
            <ResponseEditor
              value={response}
              onChange={setResponse}
              issues={verification?.verified ? [] : verification?.issues}
            />
          </Card>
        </div>
      </div>
    </>
  )
}