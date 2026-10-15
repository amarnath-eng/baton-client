import { Badge } from '../../components/ui/Badge.jsx'
import { Card } from '../../components/ui/Card.jsx'

export function StructuredSections() {
  const sections = [
    {
      id: 'A',
      title: 'Completed Work',
      tag: 'Features & Architecture',
      desc: 'Features delivered, architecture summaries, key code paths, pull request links, and system boundaries.',
      rule: 'Must contain non-empty architecture summary and at least 1 reference link.',
    },
    {
      id: 'B',
      title: 'Pending Tasks & Next Actions',
      tag: 'Ownership & Priority',
      desc: 'What remains unfinished, priority ranking, assigned owner, and immediate next action.',
      rule: 'Every critical unfinished task must have an assigned owner and a next action.',
    },
    {
      id: 'C',
      title: 'Bugs & Blockers',
      tag: 'Technical Debt',
      desc: 'Known bugs, severity levels, reproduction steps, current workarounds, and resolution status.',
      rule: 'Zero open critical or high severity bugs allowed at acknowledgement.',
    },
    {
      id: 'D',
      title: 'Technical Decisions (ADRs)',
      tag: 'Architecture Records',
      desc: 'Key architectural decisions made, reasoning, evaluated trade-offs, and rejected alternatives.',
      rule: 'Captures why decisions were made so the new team does not repeat past mistakes.',
    },
    {
      id: 'E',
      title: 'Dependencies & Risks',
      tag: 'External Systems',
      desc: 'Third-party APIs, dependent teams, environment credentials requirements, and failure modes.',
      rule: 'All external dependencies documented with known failure modes and contacts.',
    },
    {
      id: 'F',
      title: 'Setup & Operational Steps',
      tag: 'Local Runbook',
      desc: 'Local setup runbook, non-secret configuration variables, health checks, and troubleshooting guides.',
      rule: 'Receiver must successfully follow runbook and sign off local verification.',
    },
  ]

  return (
    <section id="modules" className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Module Architecture &bull; Section 5
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
          Structured Handover Modules
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          No giant unformatted text files. Every handover is organized into structured,
          verifiable modules, each with its own completion criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <Card key={sec.id} hover className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 font-mono text-xs font-bold text-white border border-zinc-700">
                  {sec.id}
                </span>
                <Badge variant="zinc">{sec.tag}</Badge>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white">
                {sec.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                {sec.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-0.5">
                Validation Rule
              </span>
              <p className="text-[11px] text-zinc-300 font-medium">
                {sec.rule}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
