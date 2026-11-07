import { useState } from 'react'

export function InteractiveWorkflowFlow() {
  const [highlightModules, setHighlightModules] = useState(false)

  const scrollToModules = (e) => {
    if (e) e.preventDefault()
    const target = document.getElementById('core-modules')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      setHighlightModules(true)
      setTimeout(() => setHighlightModules(false), 2200)
    }
  }

  const phase1Steps = [
    {
      number: '01',
      title: 'Manager Creates Handover',
      role: 'Engineering Manager',
      description:
        'The manager creates the handover workspace, specifies the service name, assigns the Outgoing and Incoming Engineers, and sets the deadline.',
      badge: '✓ Clear ownership from day one',
    },
    {
      number: '02',
      title: 'Write the 6 Modules',
      role: 'Outgoing Engineer',
      isModulesStep: true,
      description:
        'The outgoing engineer documents local setup commands, working .env keys, in-flight PR branches, and architecture decisions before submission.',
      badge: '✓ 6 structured modules enforced',
    },
    {
      number: '03',
      title: 'Manager Review',
      role: 'Engineering Manager',
      description:
        'The manager verifies completeness. If any API key or repo link is missing, changes are requested before the incoming engineer tests.',
      badge: '✓ Prevents incomplete handovers',
    },
  ]

  const phase2Steps = [
    {
      number: '04',
      title: 'Two-Way Verification',
      role: 'Incoming Engineer',
      description:
        'The incoming engineer runs setup steps locally. Any failure is logged as a blocker issue that must be fixed and re-tested before sign-off.',
      badge: '✓ Only incoming engineer verifies fixes',
    },
    {
      number: '05',
      title: 'Check & Sign-Off',
      role: 'Readiness Gate',
      description:
        'Baton automatically verifies 100% of tasks have owners, all 6 modules are complete, and zero blockers remain before recording the audit trail.',
      badge: '✓ Permanent audit trail recorded',
    },
  ]

  const modules = [
    {
      number: '01',
      title: 'Completed Work',
      description: 'Delivered features, architecture overview, and PR/repository links.',
    },
    {
      number: '02',
      title: 'Pending Tasks',
      description: 'Unfinished PRs, active branch names, priorities, and assigned owners.',
    },
    {
      number: '03',
      title: 'Bugs & Blockers',
      description: 'Known bugs, flaky tests, edge cases, technical debt, and workarounds.',
    },
    {
      number: '04',
      title: 'Technical Decisions',
      description: 'Architecture Decision Records (ADRs), trade-offs considered, and rationale.',
    },
    {
      number: '05',
      title: 'Dependencies & Risks',
      description: 'Third-party APIs, vendor credentials, failure points, and team contacts.',
    },
    {
      number: '06',
      title: 'Setup Instructions',
      description: 'Local environment run commands, sample test data, and .env keys.',
    },
  ]

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 border-t border-zinc-900/80">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          How It Works
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1.5">
          The 5 steps of a verified handover
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          From manager initiation to final sign-off, Baton keeps everyone in lockstep:
        </p>
      </div>

      {/* 5 Steps Layout: 3 Cards Top + 2 Cards Bottom */}
      <div className="space-y-3.5 sm:space-y-4 mb-6 sm:mb-8">
        {/* Row 1: Steps 01 to 03 (Documentation & Review) */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Phase 1: Setup, Authoring & Manager Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {phase1Steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors shadow-sm"
              >
                <div className="space-y-2.5">
                  {/* Step Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      STEP {step.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
                      {step.role}
                    </span>
                  </div>

                  {/* Title & Beside Learn More */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white tracking-tight leading-none">
                      {step.title}
                    </h3>

                    {step.isModulesStep && (
                      <button
                        type="button"
                        onClick={scrollToModules}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group shrink-0 leading-none"
                      >
                        <span>Learn more</span>
                        <svg
                          className="w-3 h-3 text-emerald-400 group-hover:translate-y-0.5 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Guarantee */}
                <div className="pt-2.5 border-t border-zinc-900">
                  <span className="text-xs font-mono text-emerald-400/90 block font-medium">
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transition Divider */}
        <div className="flex items-center justify-center py-1.5">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3.5 py-1.5 sm:py-0.5 rounded-xl sm:rounded-full border border-zinc-800/80 bg-zinc-900/60 text-[10.5px] sm:text-[11px] font-mono text-zinc-300 text-center shadow-sm">
            <span>Documentation Approved</span>
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Handed to Incoming Engineer</span>
          </div>
        </div>

        {/* Row 2: Steps 04 & 05 (Two-Way Verification & Readiness Sign-Off) */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Phase 2: Two-Way Verification & Final Sign-Off
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {phase2Steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors shadow-sm"
              >
                <div className="space-y-2.5">
                  {/* Step Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      STEP {step.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
                      {step.role}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Guarantee Pill */}
                <div className="pt-2.5 border-t border-zinc-900">
                  <span className="text-xs font-mono text-cyan-400/90 block font-medium">
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 6 Standard Modules Grid */}
      <div
        id="core-modules"
        className={`rounded-2xl border bg-zinc-950 p-4 sm:p-5 space-y-3.5 scroll-mt-20 sm:scroll-mt-24 transition-all duration-700 ${
          highlightModules
            ? 'border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/40'
            : 'border-zinc-800/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              The 6 Core Modules We Follow
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Every handover requires these 6 structured sections before submission:
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0 self-start sm:self-auto font-medium">
            Standard Handover Format
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {modules.map((m) => (
            <div
              key={m.number}
              className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 space-y-2 hover:border-zinc-700/60 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  MODULE {m.number}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-zinc-200">
                {m.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
