import { MAX_EMAIL_LENGTH } from '../../constants/options'

export default function EmailInput({ value, onChange }) {
  const tooLong = value.length > MAX_EMAIL_LENGTH

  return (
    <div>
      <label htmlFor="email-input" className="sr-only">Email reçu</label>
      <textarea
        id="email-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Collez ici l'email que vous avez reçu…"
        className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
      />
      <p className={`mt-2 text-right text-xs ${tooLong ? 'text-red-600' : 'text-slate-400'}`}>
        {value.length} / {MAX_EMAIL_LENGTH}
      </p>
    </div>
  )
}