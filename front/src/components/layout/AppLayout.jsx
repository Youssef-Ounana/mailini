import { History, Mail, Settings, Sparkles } from 'lucide-react'

const NAV = [
  { label: 'Assistant', icon: Sparkles, active: true },
  { label: 'Historique', icon: History, soon: true },
  { label: 'Paramètres', icon: Settings, soon: true },
]

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <Logo className="h-16 px-5" />
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ label, icon: Icon, active, soon }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-400'
              }`}
            >
              <Icon className="size-4" />
              {label}
              {soon && <span className="ml-auto text-[10px] uppercase tracking-wide">Bientôt</span>}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <Logo />
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  )
}

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
        <Mail className="size-4" />
      </div>
      <span className="font-semibold text-slate-900">Mailini</span>
    </div>
  )
}