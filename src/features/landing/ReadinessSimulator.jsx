import { useState } from 'react'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function ReadinessSimulator() {
  // State for the 7 server-side readiness rules
  const [checks, setChecks] = useState({
    managerReview: true,
    requiredSections: true,
    taskOwnership: false,
    noBlockingIssues: false,
    verificationChecklist: false,
    authorizedMember: true,
    eligibleState: true,
  })

  const [acknowledged, setAcknowledged] = useState(false)

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
    setAcknowledged(false)
  }

  const rulesList = [
    {
      key: 'managerReview',
      title: '1. Manager Review Accepted',
      desc: 'Manager formally validated completeness & accepted for verification',
    },
    {
      key: 'requiredSections',
      title: '2. All Handover Modules Complete',
      desc: 'No mandatory documentation module left empty or unverified',
    },
    {
      key: 'taskOwnership',
      title: '3. Critical Tasks Have Owner & Next Action',
      desc: 'No orphan critical unfinished tasks left without an assigned engineer',
    },
    {
      key: 'noBlockingIssues',
      title: '4. Zero Open or Unverified Blocking Issues',
      desc: 'All critical & high severity bugs are resolved and re-verified',
    },
    {
      key: 'verificationChecklist',
      title: '5. Incoming Verification Checklist Signed Off',
      desc: 'Incoming engineer verified local build, tests, and configuration',
    },
    {
      key: 'authorizedMember',
      title: '6. Authorized Company Member',
      desc: 'Incoming engineer verified to have active membership in company',
    },
    {
      key: 'eligibleState',
      title: '7. Eligible State (Not Already Completed)',
      desc: 'Handover is in verification status and eligible for completion',
    },
  ]

  const passedCount = Object.values(checks).filter(Boolean).length
  const totalCount = rulesList.length
  const isReady = passedCount === totalCount

  return (
    <section id="readiness" className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
      <Card className="border-zinc-800/80 bg-[#0c0c0e] p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              The Core Engine &bull; Section 7
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              Server-Side Readiness Simulator
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl">
              The backend computes readiness from persisted database records. It rejects
              acknowledgement if even a single check fails. Click checks below to test:
            </p>
          </div>

          {/* Verdict Card */}
          <div
            className={`rounded-2xl border p-5 text-center w-full lg:w-auto lg:min-w-[280px] transition-all duration-300 ${
              isReady
                ? 'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-500/5'
                : 'border-zinc-800 bg-zinc-900/60 shadow-lg'
            }`}
          >
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-1">
              Server API Verdict
            </span>
            <div
              className={`text-sm sm:text-base font-bold tracking-tight ${
                isReady ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isReady ? 'READY FOR ACKNOWLEDGEMENT' : 'BLOCKED FROM COMPLETION'}
            </div>
            <div className="mt-2 text-xs font-mono text-zinc-500">
              {passedCount} of {totalCount} mandatory rules passed
            </div>
          </div>
        </div>

        {/* Check Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-8">
          {rulesList.map((rule) => {
            const isPassed = checks[rule.key]
            return (
              <button
                key={rule.key}
                type="button"
                onClick={() => toggleCheck(rule.key)}
                className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                  isPassed
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500/50'
                    : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <span className="text-xs sm:text-sm shrink-0 mt-0.5 font-bold">
                  {isPassed ? '✓' : '○'}
                </span>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-200">
                    {rule.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </button>
            )
          })}

          {/* Acknowledgement Simulation Box */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-black/60 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-300 block font-semibold">
                Simulate POST /acknowledge
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isReady
                  ? 'All 7 checks pass. Incoming engineer can sign off.'
                  : 'Backend refuses acknowledgement until 100% of checks pass.'}
              </p>
            </div>

            <div className="mt-3">
              <Button
                variant={isReady ? 'primary' : 'secondary'}
                disabled={!isReady}
                onClick={() => setAcknowledged(true)}
                className="w-full text-xs py-2"
              >
                {acknowledged ? 'Acknowledged & Audited ✓' : 'Acknowledge Handover'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
