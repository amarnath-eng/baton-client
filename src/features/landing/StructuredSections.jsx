export function StructuredSections() {
  const modules = [
    {
      num: '01',
      title: 'Completed Work',
      desc: 'Architecture overview, delivered features, key code paths, and PR links.',
    },
    {
      num: '02',
      title: 'In-Flight Tasks',
      desc: 'Unfinished PRs, priorities, and assigned owners with immediate next actions.',
    },
    {
      num: '03',
      title: 'Bugs & Blockers',
      desc: 'Known technical debt, reproduction notes, and workarounds tracked as issues.',
    },
    {
      num: '04',
      title: 'Technical Decisions',
      desc: 'Architectural Decision Records (ADRs) explaining trade-offs and rationale.',
    },
    {
      num: '05',
      title: 'Dependencies & Risks',
      desc: 'Third-party APIs, infra bottlenecks, single points of failure, and team contacts.',
    },
    {
      num: '06',
      title: 'Setup Runbook',
      desc: 'Local environment bootstrap steps, non-secret env vars, and sanity smoke tests.',
    },
  ]

  return (
    <section id="modules" className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Standardized Structure
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
          6 Modules. Zero orphan tasks.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          No endless unformatted text. Every handover is organized into verified, reviewable sections.
        </p>
      </div>

      {/* 6 Clean Scannable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => (
          <div
            key={m.num}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6 space-y-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-zinc-400">
                {m.num}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {m.title}
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
