export function ProblemComparison() {
  const comparisons = [
    {
      number: '01',
      topic: 'Local Setup',
      traditional: {
        title: 'Broken Notes & Missing Keys',
        description:
          'You clone the repo, run the commands, and hit missing .env variables or broken doc links that haven\'t been updated in months.',
      },
      baton: {
        title: 'Tested Setup Guide',
        description:
          'The outgoing engineer provides working setup commands, environment keys, and architecture links that are verified before handoff.',
      },
    },
    {
      number: '02',
      topic: 'Testing Together',
      traditional: {
        title: '"Works on My Machine"',
        description:
          'The outgoing engineer signs off on their last day. Monday morning you are left alone debugging broken test data, setup errors, and missing access.',
      },
      baton: {
        title: 'Test Before They Leave',
        description:
          'You run the steps right away. If anything breaks, you flag it as a blocker and get it fixed while they are still here to help.',
      },
    },
    {
      number: '03',
      topic: 'Task Ownership',
      traditional: {
        title: 'A Quick Thumbs-Up in Chat',
        showThumbsUp: true,
        description:
          'Someone leaves a quick reaction in a chat thread and calls it done. Weeks later, an unfinished PR breaks in staging and nobody knows who owns it.',
      },
      baton: {
        title: 'Clear Owners for Every Task',
        description:
          'Baton won\'t let anyone complete the handover until every open PR has a new owner and all setup blockers are marked resolved.',
      },
    },
  ]

  return (
    <section id="why-baton" className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 border-t border-zinc-900/80">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Why Baton
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1.5">
          Why traditional handovers fail
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Documentation alone doesn't prevent broken handovers. Here is what usually goes wrong vs. how Baton fixes it:
        </p>
      </div>

      {/* 3-Column Single-View Grid (Flat, Effortless to Read) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {comparisons.map((item) => (
          <div
            key={item.number}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
          >
            {/* Header: Number & Topic */}
            <div className="border-b border-zinc-800/80 pb-2.5 mb-3">
              <span className="font-mono text-xs font-semibold text-zinc-300">
                {item.number} &bull; {item.topic}
              </span>
            </div>

            {/* The Old Way */}
            <div className="space-y-1.5 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-rose-400 block">
                The Old Way
              </span>
              <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                <span>{item.traditional.title}</span>
                {item.traditional.showThumbsUp && (
                  <span role="img" aria-label="thumbs up">👍</span>
                )}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.traditional.description}
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-zinc-800/60 my-1" />

            {/* The Baton Way */}
            <div className="space-y-1.5 pt-3">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-400 block">
                The Baton Way
              </span>
              <h4 className="text-sm font-semibold text-white">
                {item.baton.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.baton.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
