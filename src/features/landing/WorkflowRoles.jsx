export function WorkflowRoles() {
  const steps = [
    {
      step: '01',
      title: 'Document & Review',
      actor: 'Outgoing Engineer & Manager',
      desc: 'The outgoing engineer fills the 6 structured modules. The engineering manager reviews the runbook and approves verification.',
    },
    {
      step: '02',
      title: 'Verify & Test',
      actor: 'Incoming Engineer',
      desc: 'The incoming engineer tests local instructions. Any missing credentials or broken scripts are flagged as tracked blocking issues.',
    },
    {
      step: '03',
      title: 'Sign-off & Continuity',
      actor: 'Server Engine & Incoming Engineer',
      desc: 'The server verifies zero open blockers and full task ownership. The incoming engineer formally signs off into the append-only audit trail.',
    },
  ]

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Effortless Workflow
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
          How Baton works in 3 steps
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          A seamless transition process from preparation to verified completion.
        </p>
      </div>

      {/* 3 Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div
            key={s.step}
            className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 sm:p-7 space-y-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-extrabold text-white">
                {s.step}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900">
                {s.actor}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {s.title}
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
