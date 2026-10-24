import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/paths.js'
import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-8 sm:pt-16 sm:pb-12 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2">
          <Badge variant="zinc">
            Structured &bull; Reviewable &bull; Verifiable
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-[26px] leading-[1.2] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          A handover is not complete just because someone wrote documentation.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          It is complete only when the receiving engineer has verified the work,
          critical issues have been resolved, required ownership is clear, and the
          system confirms readiness.
        </p>

        {/* Mobile Call to Actions (Get Started Free + Test Readiness Engine) */}
        <div className="flex sm:hidden flex-col items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.REGISTER} className="w-full">
            <Button
              variant="primary"
              className="group w-full justify-center text-sm font-semibold py-2.5 px-6 shadow-sm shadow-white/10"
            >
              <span>Get Started Free</span>
            </Button>
          </Link>
          <a href="#readiness" className="w-full">
            <Button
              variant="secondary"
              className="w-full justify-center text-sm font-medium py-2.5 px-5"
            >
              <span>Test Readiness Engine</span>
              <svg
                className="w-4 h-4 ml-1.5 shrink-0 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Button>
          </a>
          <p className="text-[11px] text-zinc-500 pt-0.5">
            Built for engineering teams &bull; No credit card required
          </p>
        </div>

        {/* Desktop Call to Actions (Test Readiness Engine + Explore 9-Step Workflow) */}
        <div className="hidden sm:flex items-center justify-center gap-4 pt-2">
          <a href="#readiness">
            <Button variant="primary" className="group">
              <span>Test Readiness Engine</span>
              <svg
                className="w-4 h-4 ml-1.5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Button>
          </a>
          <a href="#workflow">
            <Button variant="secondary" className="group">
              <span>Explore 9-Step Workflow</span>
              <svg
                className="w-4 h-4 ml-1.5 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Button>
          </a>
        </div>
      </div>

      {/* Hero Visual: Live Handover Inspector Card */}
      <div className="mt-6 sm:mt-10 mx-auto max-w-2xl text-left">
        <Card className="p-4 sm:p-6 border-zinc-800/80 bg-[#0c0c0e] shadow-2xl">
          <div className="flex items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 sm:pb-4">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                ACTIVE HANDOVER #104
              </span>
              <h3 className="text-xs sm:text-base font-bold text-white leading-snug">
                Core Payments Service &bull; Transition
              </h3>
            </div>
            <Badge variant="zinc" className="shrink-0 text-[10px] sm:text-xs px-2 py-0.5">VERIFICATION</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-zinc-800/60">
            <div>
              <span className="text-[10px] sm:text-xs text-zinc-500 block">Outgoing Engineer</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-200 block leading-snug">Amarnath</span>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs text-zinc-500 block">Incoming Engineer</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-200 block leading-snug">Mani Shankar</span>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-amber-300 font-medium leading-tight">
                1 Blocker Awaiting Re-verification
              </span>
            </div>
            <Badge variant="rose" className="shrink-0 self-start sm:self-auto text-[10px] sm:text-xs px-2 py-0.5">Server: BLOCKED</Badge>
          </div>
        </Card>
      </div>
    </section>
  )
}
