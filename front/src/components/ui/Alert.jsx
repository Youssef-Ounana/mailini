import { AlertCircle, X } from 'lucide-react'

export default function Alert({ message, onClose }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="text-red-500 hover:text-red-700"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}