import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-10 sm:pt-16 sm:pb-12 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2">
          <Badge variant="zinc">
            Structured &bull; Reviewable &bull; Verifiable
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          A handover is not complete just because someone wrote documentation.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          It is complete only when the receiving engineer has verified the work,
          critical issues have been resolved, required ownership is clear, and the
          system confirms readiness.
        </p>

        {/* Mobile Call to Actions (Get Started Free + Test Readiness Engine) */}
        <div className="flex sm:hidden flex-col items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            className="group w-full justify-center text-sm font-semibold py-2.5 px-6 shadow-sm shadow-white/10"
          >
            <span>Get Started Free</span>
          </Button>
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
      <div className="mt-10 mx-auto max-w-2xl text-left">
        <Card className="border-zinc-800/80 bg-[#0c0c0e] shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-0.5">
                ACTIVE HANDOVER #104
              </span>
              <h3 className="text-base font-bold text-white">
                Core Payments Service &bull; Transition
              </h3>
            </div>
            <Badge variant="zinc">VERIFICATION</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-zinc-800/60">
            <div>
              <span className="text-zinc-500 block">Outgoing Engineer</span>
              <span className="font-semibold text-zinc-200">Amarnath</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Incoming Engineer</span>
              <span className="font-semibold text-zinc-200">Mani Shankar</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-medium">
                1 Blocker Awaiting Incoming Re-verification
              </span>
            </div>
            <Badge variant="rose">Server: BLOCKED</Badge>
          </div>
        </Card>
      </div>
    </section>
  )
}
