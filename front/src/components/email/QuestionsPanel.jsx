import { PenLine } from 'lucide-react'
import Button from '../ui/Button'
import { TONES } from '../../constants/options'

export default function QuestionsPanel({ plan, answers, onAnswerChange, onSubmit, currentTone, onApplyTone, disabled }) {
  const suggested = TONES.find((t) => t.value === plan.suggestedTone)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {plan.missingInfo.length > 0
          ? "L'agent a besoin de ces informations pour répondre sans rien inventer. Laissez un champ vide pour obtenir un espace réservé à compléter."
          : 'Aucune information manquante.'}
      </p>

      {plan.missingInfo.map(({ id, question }) => (
        <div key={id}>
          <label htmlFor={`answer-${id}`} className="mb-1 block text-sm font-medium text-slate-700">
            {question}
          </label>
          <input
            id={`answer-${id}`}
            type="text"
            maxLength={500}
            value={answers[id] ?? ''}
            onChange={(e) => onAnswerChange(id, e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>
      ))}

      {suggested && suggested.value !== currentTone && (
        <p className="text-xs text-slate-500">
          Ton suggéré : <span className="font-medium text-slate-700">{suggested.label}</span>{' '}
          <button type="button" onClick={() => onApplyTone(suggested.value)} className="underline hover:text-slate-900">
            Utiliser ce ton
          </button>
        </p>
      )}

      <div className="flex justify-end">
        <Button icon={PenLine} onClick={onSubmit} disabled={disabled}>
          Rédiger la réponse
        </Button>
      </div>
    </div>
  )
}