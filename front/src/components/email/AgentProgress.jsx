import { Check, Loader2 } from 'lucide-react'

const STEPS = [
  { key: 'plan', label: 'Analyse et plan' },
  { key: 'input', label: 'Vos réponses' },
  { key: 'write', label: 'Rédaction et vérification' },
  { key: 'done', label: 'Réponse prête' },
]

export default function AgentProgress({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)

  return (
    <ol className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
      {STEPS.map((step, index) => {
        const done = index < currentIndex || current === 'done'
        const active = index === currentIndex && !done
        const loading = active && step.key !== 'input'

        return (
          <li
            key={step.key}
            className={`flex items-center gap-1.5 ${done || active ? 'text-slate-900' : 'text-slate-400'} ${active ? 'font-medium' : ''}`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
                done ? 'border-slate-900 bg-slate-900 text-white' : active ? 'border-slate-900' : 'border-slate-300'
              }`}
            >
              {done ? <Check className="size-3" /> : loading ? <Loader2 className="size-3 animate-spin" /> : index + 1}
            </span>
            {step.label}
          </li>
        )
      })}
    </ol>
  )
}