import { Shimmer } from './Shimmer.jsx'
import HandoverCardSkeleton from '../../features/handovers/components/HandoverCardSkeleton.jsx'

/**
 * High-fidelity, zero-layout-shift Shimmer Skeleton for Dashboard & Protected Routes.
 * Replaces jarring full-screen loading spinners and splash screens.
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Top Navigation Shimmer Skeleton */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-2xl">
        <div className="mx-auto grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] h-14 sm:h-16 max-w-7xl items-center px-3 sm:px-4">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Shimmer className="h-7 w-7" rounded="rounded-lg" />
            <Shimmer className="h-4 w-14" rounded="rounded" />
            <span className="text-zinc-800">/</span>
            <Shimmer className="h-5 w-24" rounded="rounded-md" />
          </div>

          {/* Center Tabs (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
            <Shimmer className="h-7 w-24" rounded="rounded-lg" />
            <Shimmer className="h-7 w-20" rounded="rounded-lg" />
            <Shimmer className="h-7 w-20" rounded="rounded-lg" />
          </div>

          {/* User Menu (Right) */}
          <div className="flex items-center justify-end gap-2.5">
            <Shimmer className="h-8 w-8" rounded="rounded-full" />
          </div>
        </div>

        {/* Mobile Tabs Row */}
        <div className="flex md:hidden items-center justify-around px-3 py-2 border-t border-zinc-900 gap-2">
          <Shimmer className="h-7 flex-1" rounded="rounded-lg" />
          <Shimmer className="h-7 flex-1" rounded="rounded-lg" />
          <Shimmer className="h-7 flex-1" rounded="rounded-lg" />
        </div>
      </header>

      {/* Main Workspace Body Skeleton */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-4">
        {/* Subnav & Action Header */}
        <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-900">
          {/* Filter Pills Skeleton */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden">
            <Shimmer className="h-7 w-28 sm:w-20" rounded="rounded-lg" />
            <Shimmer className="h-7 w-20 hidden sm:block" rounded="rounded-lg" />
            <Shimmer className="h-7 w-24 hidden sm:block" rounded="rounded-lg" />
            <Shimmer className="h-7 w-20 hidden sm:block" rounded="rounded-lg" />
          </div>

          {/* Action Button Skeleton */}
          <Shimmer className="h-7 w-28 sm:w-32 shrink-0" rounded="rounded-lg" />
        </div>

        {/* 4 Shimmer Handover Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
        </div>
      </main>
    </div>
  )
}

export default DashboardSkeleton
