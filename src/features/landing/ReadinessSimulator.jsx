import { useState } from 'react'
import { Card } from '../../components/ui/Card.jsx'

export function ReadinessSimulator() {
  const [checks, setChecks] = useState({
    managerReview: true,
    requiredSections: true,
    noBlockingIssues: false,
    verificationChecklist: true,
  })

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const rules = [
    {
      key: 'managerReview',
      title: 'Manager Review Approved',
      desc: 'Manager formally validated completeness and allowed verification.',
    },
    {
      key: 'requiredSections',
      title: '6 Structured Modules Complete',
      desc: 'Architecture, runbooks, and decisions are documented.',
    },
    {
      key: 'noBlockingIssues',
      title: 'Zero Blocking Issues Open',
      desc: 'All critical and high-severity issues verified & closed.',
    },
    {
      key: 'verificationChecklist',
      title: 'Incoming Local Setup Verified',
      desc: 'Incoming engineer successfully ran smoke tests locally.',
    },
  ]

  const passedCount = Object.values(checks).filter(Boolean).length
  const isReady = passedCount === rules.length

  return (
    <section id="readiness" className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Interactive Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Server-Side Readiness Engine
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Baton never relies on a simple client checkbox. The server evaluates live database records before allowing final sign-off. Click below to test the rules:
            </p>
          </div>

          {/* Verdict Box */}
          <div
            className={`rounded-2xl border p-5 text-center min-w-[260px] transition-all duration-200 ${
              isReady
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Server Gate Verdict
            </span>
            <div className="text-sm font-bold tracking-tight">
              {isReady ? 'READY FOR SIGN-OFF' : 'BLOCKED FROM COMPLETION'}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              {passedCount} of {rules.length} checks passing
            </p>
          </div>
        </div>

        {/* 4 Clickable Rule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
          {rules.map((rule) => {
            const passed = checks[rule.key]
            return (
              <button
                key={rule.key}
                type="button"
                onClick={() => toggleCheck(rule.key)}
                className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start justify-between gap-3 ${
                  passed
                    ? 'border-emerald-500/30 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
                    : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        passed ? 'bg-emerald-400' : 'bg-zinc-600'
                      }`}
                    />
                    {rule.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 pl-4">
                    {rule.desc}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                    passed
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {passed ? 'PASSED' : 'BLOCKED'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
