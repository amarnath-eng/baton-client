import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'
import { Badge } from '../../../components/ui/Badge.jsx'

// Left 50% split panel with centered cohesive layout and uniform tight spacing
export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden flex-col justify-center items-center border-r border-zinc-800/80 bg-[#070709] p-8 xl:p-12 relative">
      {/* Subtle ambient lighting for depth */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl" />

      {/* Unified container where all sections share consistent, natural gap */}
      <div className="max-w-md w-full space-y-5 relative z-10">
        {/* Brand Home Link */}
        <div>
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black text-base shadow-sm">
              B
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight group-hover:text-zinc-300 transition-colors">
              Baton
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
              v0.1
            </span>
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="space-y-2">
          <Badge variant="zinc">Workspace Onboarding</Badge>
          <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
            Stop relying on tribal knowledge and Notion dumps.
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Set up your organization's continuity workspace in seconds. Ensure every critical service transition is verified before ownership transfers.
          </p>
        </div>

        {/* Live Handover Verification Mockup Card */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-5 shadow-2xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block">HANDOVER #104</span>
              <span className="text-xs font-bold text-white">Core Payments Service</span>
            </div>
            <Badge variant="emerald">VERIFIED</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-zinc-500 text-[11px] block">Outgoing</span>
              <span className="font-semibold text-zinc-200">Amarnath</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[11px] block">Incoming</span>
              <span className="font-semibold text-zinc-200">Mani Shankar</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
            <span>Server Engine: 7/7 Rules Verified</span>
            <span>✓ Complete</span>
          </div>
        </div>

        {/* Continuity Pillars */}
        <ul className="space-y-2 text-xs text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
            <span>Zero orphan tasks or unmonitored production cron jobs</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
            <span>Server-side readiness engine enforces complete verification</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
            <span>Full audit history and transition sign-off log</span>
          </li>
        </ul>

        {/* Bottom Note */}
        <div className="pt-1 text-[11px] text-zinc-600 font-mono">
          Baton Continuity Engine &bull; Multi-Tenant Workspace
        </div>
      </div>
    </div>
  )
}
