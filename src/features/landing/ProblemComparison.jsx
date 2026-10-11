import { Card } from '../../components/ui/Card.jsx'

export function ProblemComparison() {
  const comparisonItems = [
    {
      dimension: 'Workflow & Process',
      ordinary: 'Someone writes a free-form document and hopes for the best',
      baton: 'Information follows a strictly defined, 9-stage state machine',
    },
    {
      dimension: 'Completion Criteria',
      ordinary: 'Subjective feeling of completion or verbal agreement',
      baton: 'Readiness evaluated by 7 strict, server-side business rules',
    },
    {
      dimension: 'Missing Information & Gaps',
      ordinary: 'Easily overlooked until broken in production weeks later',
      baton: 'Receiving engineer raises first-class issues with resolution loops',
    },
    {
      dimension: 'Approvals & Sign-off',
      ordinary: 'Informal thumbs-up lost in Slack or Teams threads',
      baton: 'Formal manager review and receiver acknowledgement recorded',
    },
    {
      dimension: 'Audit History',
      ordinary: 'Difficult to reconstruct who knew what and when',
      baton: 'Every state transition preserved in an append-only audit trail',
    },
    {
      dimension: 'Receiver Responsibility',
      ordinary: 'Expected to figure it out after original engineer leaves',
      baton: 'Receiver actively verifies setup before accepting accountability',
    },
  ]

  return (
    <section id="problem" className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
      <Card className="p-4 sm:p-10 border-zinc-800/80 bg-[#0c0c0e]">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Why Ordinary Documents Fail
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 text-balance">
            Ordinary Document vs. Baton
          </h2>
          <p className="mt-2 text-sm text-zinc-400 text-balance">
            Baton manages the transfer of engineering knowledge and accountability, not just files.
          </p>
        </div>

        {/* Desktop Comparison Table (Visible on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4 text-zinc-400">Ordinary Document</th>
                <th className="py-3 px-4 text-white">Baton Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-4 text-zinc-300 font-semibold whitespace-nowrap">
                    {item.dimension}
                  </td>
                  <td className="py-4 px-4 text-zinc-500">
                    ✕ {item.ordinary}
                  </td>
                  <td className="py-4 px-4 text-zinc-100">
                    ✓ {item.baton}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Comparison Cards (Visible only on mobile < md) */}
        <div className="md:hidden space-y-4">
          {comparisonItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/90 bg-black/40 p-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-2">
                {item.dimension}
              </h3>

              <div className="space-y-2 text-xs">
                {/* Ordinary Document Failure */}
                <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Ordinary Document
                  </span>
                  <p className="text-zinc-400 leading-relaxed">
                    <span className="text-rose-400 mr-1.5 font-bold">✕</span>
                    {item.ordinary}
                  </p>
                </div>

                {/* Baton Platform Solution */}
                <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Baton Platform
                  </span>
                  <p className="text-zinc-100 font-medium leading-relaxed">
                    <span className="text-emerald-400 mr-1.5 font-bold">✓</span>
                    {item.baton}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
