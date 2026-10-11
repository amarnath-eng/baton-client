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

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a href="#readiness">
            <Button variant="primary">
              Test Readiness Engine ↓
            </Button>
          </a>
          <a href="#workflow">
            <Button variant="secondary">
              Explore 9-Step Workflow
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
