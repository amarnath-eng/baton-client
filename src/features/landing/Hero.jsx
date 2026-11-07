import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/paths.js'
import { Button } from '../../components/ui/Button.jsx'

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-6 pb-8 sm:pt-10 sm:pb-12 sm:px-6 lg:px-8">
      {/* 2-Column Responsive Hero: Matches Navbar Width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-center">
        
        {/* Left Column: Heading, Statement & Action Buttons */}
        <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] text-xs text-zinc-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-zinc-200">Engineering Handover Platform</span>
              <span className="hidden sm:inline text-zinc-600">&bull;</span>
              <span className="hidden sm:inline text-emerald-400 font-mono text-[11px] font-semibold">Two-Way Verified</span>
            </span>
          </div>

          {/* Strong, Natural Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Never get stuck on an engineering{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400">
              handover again.
            </span>
          </h1>

          {/* Mobile Subtitle: Option 3 (Clean & conversational, ~3 lines) */}
          <p className="sm:hidden text-sm text-zinc-300 leading-relaxed font-normal text-pretty">
            Static docs miss critical details: working keys, runnable commands, and PR owners. With Baton, incoming engineers test the setup and resolve blockers with outgoing engineers before anyone signs off.
          </p>

          {/* Tablet & Desktop Subtitle: Full Rich Context */}
          <p className="hidden sm:block text-sm sm:text-base text-zinc-300 leading-relaxed font-normal max-w-2xl">
            Most handover documents fail because critical things are missing: working <code className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-1 py-0.5 rounded">.env</code> keys, 
            setup commands that actually run, and clear owners for in-flight PRs.
            <br className="hidden sm:inline" />
            <span className="text-white font-medium"> Baton fixes this</span> by having the incoming engineer test the setup, 
            resolve blockers with the outgoing engineer, and verify everything runs before anyone signs off.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button
                variant="primary"
                className="group w-full sm:w-auto text-xs sm:text-sm font-semibold px-7 py-3 bg-white text-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 inline-flex items-center justify-center gap-2"
              >
                <span>Verify Your Next Handover</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                className="group w-full sm:w-auto text-xs sm:text-sm font-medium px-6 py-3 border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>See How It Works</span>
                <svg
                  className="w-4 h-4 text-zinc-400 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </Button>
            </a>
          </div>
        </div>

        {/* Right Column: Live Handover Workspace Preview Card */}
        <div className="lg:col-span-5 text-left">
          <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-zinc-950 p-3 sm:p-5 shadow-xl sm:shadow-2xl backdrop-blur-xl space-y-2 sm:space-y-3">
            
            {/* Clean Window Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 sm:pb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Window Dots (Desktop only) */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Core Payments Service
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] sm:text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                In Verification
              </span>
            </div>

            {/* Visual Handover Transfer Row */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-1 sm:space-y-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 tracking-wider block">
                Handover Transfer
              </span>
              <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                <div>
                  <span className="font-semibold text-white block">Amarnath</span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400">Outgoing Engineer</span>
                </div>
                <div className="flex items-center text-zinc-500 px-2 shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-white block">Mani Shankar</span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-400">Incoming Engineer</span>
                </div>
              </div>
            </div>

            {/* Clear Blocker Resolved & Verified Card */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Blocker Tested &amp; Resolved
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
              {/* Mobile: Ultra-clean concise line */}
              <p className="sm:hidden text-[11px] text-zinc-300 leading-snug">
                Stripe sandbox keys added to <code className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded">.env</code>. Webhooks verified.
              </p>
              {/* Desktop: Full detailed quote */}
              <p className="hidden sm:block text-xs text-zinc-300 leading-relaxed">
                "Stripe sandbox keys added to <code className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-1 py-0.5 rounded">.env</code>. Local webhook test ran with zero errors."
              </p>
            </div>

            {/* Simple Readiness Result */}
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] sm:text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 block">System Readiness</span>
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-200">
                  4 of 4 checks passed
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                ✓ Ready to Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
