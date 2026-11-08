import { Shimmer } from '../../../components/ui/Shimmer.jsx'

/**
 * Single Responsibility: Presentational loading skeleton for AcceptInviteCard.
 */
export function AcceptInviteSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-1.5 flex flex-col items-center">
        <Shimmer className="h-3 w-32" rounded="rounded" />
        <Shimmer className="h-7 w-24" rounded="rounded-md" />
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl space-y-6">
        <div className="space-y-2.5 text-center pb-4 border-b border-zinc-900 flex flex-col items-center">
          <Shimmer className="h-5 w-24" rounded="rounded-full" />
          <Shimmer className="h-6 w-48" rounded="rounded-md" />
          <Shimmer className="h-3.5 w-64" rounded="rounded" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-16" rounded="rounded" />
            <Shimmer className="h-10 w-full" rounded="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-16" rounded="rounded" />
            <Shimmer className="h-10 w-full" rounded="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-28" rounded="rounded" />
            <Shimmer className="h-10 w-full" rounded="rounded-xl" />
          </div>
          <Shimmer className="h-10 w-full mt-2" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

