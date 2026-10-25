import { Shimmer } from '../../../components/ui/Shimmer.jsx'

/**
 * Shimmer skeleton placeholder for HandoverCard during loading states
 */
export default function HandoverCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 space-y-4 shadow-sm">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-16" rounded="rounded" />
            <Shimmer className="h-4 w-20" rounded="rounded-full" />
          </div>
          <Shimmer className="h-5 w-48 sm:w-64" rounded="rounded-md" />
        </div>

        <div className="space-y-1.5 text-right flex flex-col items-end">
          <Shimmer className="h-3 w-16" rounded="rounded" />
          <Shimmer className="h-4 w-20" rounded="rounded" />
        </div>
      </div>

      {/* Description lines */}
      <div className="space-y-1.5">
        <Shimmer className="h-3 w-full" rounded="rounded" />
        <Shimmer className="h-3 w-4/5" rounded="rounded" />
      </div>

      {/* Participants Footer */}
      <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <Shimmer className="h-2.5 w-12" rounded="rounded" />
            <Shimmer className="h-3.5 w-24" rounded="rounded" />
          </div>
          <div className="text-zinc-700 text-xs">→</div>
          <div className="space-y-1">
            <Shimmer className="h-2.5 w-12" rounded="rounded" />
            <Shimmer className="h-3.5 w-24" rounded="rounded" />
          </div>
        </div>

        <Shimmer className="h-3 w-20" rounded="rounded" />
      </div>
    </div>
  )
}

