import HandoverStatusBadge from './HandoverStatusBadge.jsx'
import { HANDOVER_SECTIONS } from '../../../constants/handover.js'

/**
 * Single Responsibility: Renders the header summary card for a handover,
 * displaying metadata, project badge, status, participants, and section progress bar.
 */
export default function HandoverHeroCard({ handover, completedSectionsCount }) {
  const deadlineStr = handover.deadline
    ? new Date(handover.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No deadline'

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              {handover.project}
            </span>
            <HandoverStatusBadge status={handover.status} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {handover.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            {handover.reason}
          </p>
        </div>

        <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-900">
          <span className="text-[11px] text-zinc-500">Target Deadline</span>
          <span className="text-sm font-semibold text-zinc-200">{deadlineStr}</span>
        </div>
      </div>

      {/* Transfer Participants & Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900 text-xs">
        {/* Outgoing */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[11px] text-zinc-300">
            {handover.outgoingEngineerId?.fullName?.charAt(0) || 'O'}
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">
              Outgoing Engineer
            </span>
            <span className="text-zinc-200 font-medium">
              {handover.outgoingEngineerId?.fullName || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Incoming */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[11px] text-zinc-300">
            {handover.incomingEngineerId?.fullName?.charAt(0) || 'I'}
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">
              Incoming Engineer
            </span>
            <span className="text-zinc-200 font-medium">
              {handover.incomingEngineerId?.fullName || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-center space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Continuity Progress</span>
            <span className="font-mono text-zinc-300">
              {completedSectionsCount} of {HANDOVER_SECTIONS.length} Complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{
                width: `${(completedSectionsCount / HANDOVER_SECTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

