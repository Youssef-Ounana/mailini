export default function ResponseEditor({ value, onChange, issues = [] }) {
  if (value === null) {
    return (
      <p className="text-sm text-slate-500">
        La réponse préparée par l'agent apparaîtra ici. Vous pourrez la modifier avant de l'utiliser.
      </p>
    )
  }

 const placeholders = value.match(/\[[^\]]+\]/g)?.length ?? 0

  return (
    <div>
      <textarea
        aria-label="Réponse générée"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="w-full resize-y rounded-lg border border-slate-200 p-4 text-sm leading-relaxed text-slate-900 focus:border-slate-400 focus:outline-none"
      />

      {placeholders > 0 && (
        <p className="mt-2 text-xs text-amber-700">
          {placeholders} élément{placeholders > 1 ? 's' : ''} entre crochets à compléter avant l'envoi.
        </p>
      )}

      {issues.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {issues.map((issue, index) => (
            <li key={index}>{issue.detail}</li>
          ))}
        </ul>
      )}
    </div>
  )
}