import { useSelector } from 'react-redux'
import { Button } from '../../components/ui/Button.jsx'
import SelectDropdown from '../../components/ui/SelectDropdown.jsx'
import { useHandovers } from './hooks/useHandovers.js'
import { useDeferredLoading } from '../../hooks/useDeferredLoading.js'
import HandoverCard from './components/HandoverCard.jsx'
import HandoverCardSkeleton from './components/HandoverCardSkeleton.jsx'
import CreateHandoverModal from './components/CreateHandoverModal.jsx'

export default function HandoversPanel() {
  const { role: currentUserRole } = useSelector((state) => state.auth)
  const canCreate = currentUserRole === 'admin' || currentUserRole === 'manager'

  const {
    handovers,
    loading,
    error,
    setError,
    statusFilter,
    setStatusFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    refetch,
  } = useHandovers()

  // Eliminates skeleton flash when API is fast (< 150ms)
  const showSkeleton = useDeferredLoading(loading, { delayMs: 150, minDurationMs: 300 })

  const filterOptions = [
    {
      label: 'All',
      value: '',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: 'Draft',
      value: 'draft',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: 'In Preparation',
      value: 'in_preparation',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Verification',
      value: 'verification',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: 'completed',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Sleek Action & Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 sm:pb-4">
        {/* Mobile: Ultra-Modern Dropdown Selector */}
        <div className="sm:hidden">
          <SelectDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={filterOptions}
          />
        </div>

        {/* Desktop: Filter Pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                statusFilter === opt.value
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        {canCreate && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="shrink-0 text-xs py-1.5 px-3.5 shadow-sm shadow-white/10 flex items-center gap-1.5"
          >
            <span className="text-sm font-semibold leading-none">+</span>
            <span className="sm:hidden">Handover</span>
            <span className="hidden sm:inline">New Handover</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Body */}
      {showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
          <HandoverCardSkeleton />
        </div>
      ) : handovers.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center space-y-2 animate-fade-in">
          <p className="text-sm font-semibold text-white">No handovers found</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {canCreate
              ? 'Click "+ New Handover" to initiate a structured knowledge transfer between team engineers.'
              : 'You do not have any active handovers assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {handovers.map((h) => (
            <HandoverCard key={h._id} handover={h} />
          ))}
        </div>
      )}

      {/* Create Handover Modal */}
      <CreateHandoverModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => refetch()}
      />
    </div>
  )
}
