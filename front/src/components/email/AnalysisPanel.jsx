const URGENCY = {
  low: { label: 'Faible', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Moyenne', className: 'bg-amber-50 text-amber-700' },
  high: { label: 'Élevée', className: 'bg-red-50 text-red-700' },
}

export default function AnalysisPanel({ analysis }) {
  if (!analysis) {
    return (
      <p className="text-sm text-slate-500">
        Lancez l'analyse pour voir l'intention, l'urgence et les points clés de l'email.
      </p>
    )
  }

  const urgency = URGENCY[analysis.urgency] ?? URGENCY.low

  return (
    <div className="space-y-4">
      <Field label="Sujet" value={analysis.subject} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Intention" value={analysis.intent} />
        <Field label="Ton détecté" value={analysis.tone} />
      </div>
      <div>
        <p className="text-xs text-slate-500">Urgence</p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${urgency.className}`}>
          {urgency.label}
        </span>
      </div>
      <Field label="Résumé" value={analysis.summary} />
      <div>
        <p className="text-xs text-slate-500">Points clés</p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-700">
          {analysis.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900">{value}</p>
    </div>
  )
}