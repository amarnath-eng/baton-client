import HandoverStatusBadge from './HandoverStatusBadge.jsx'

export default function HandoverCard({ handover, onSelect }) {
  const deadlineStr = handover.deadline
    ? new Date(handover.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No deadline'

  return (
    <div
      onClick={() => onSelect?.(handover)}
      className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 hover:border-zinc-700 transition cursor-pointer space-y-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {handover.project}
            </span>
            <HandoverStatusBadge status={handover.status} />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight mt-2">
            {handover.title}
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-zinc-500 block">Target Deadline</span>
          <span className="text-xs font-medium text-zinc-300">{deadlineStr}</span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 line-clamp-2">
        {handover.reason}
      </p>

      {/* Participants Footer */}
      <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Outgoing</span>
            <span className="text-zinc-300 font-medium">
              {handover.outgoingEngineerId?.fullName || 'Unassigned'}
            </span>
          </div>

          <span className="text-zinc-600">→</span>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Incoming</span>
            <span className="text-zinc-300 font-medium">
              {handover.incomingEngineerId?.fullName || 'Unassigned'}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-zinc-500 font-mono">
          Created by {handover.createdBy?.fullName || 'Manager'}
        </span>
      </div>
    </div>
  )
}
