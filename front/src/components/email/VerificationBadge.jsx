import { AlertTriangle, ShieldCheck } from 'lucide-react'

export default function VerificationBadge({ verification }) {
  if (!verification) return null

  return verification.verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <ShieldCheck className="size-3.5" />
      Vérifiée
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      <AlertTriangle className="size-3.5" />
      À relire
    </span>
  )
}