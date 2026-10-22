import { useSelector } from 'react-redux'
import { Button } from '../../components/ui/Button.jsx'
import { useHandovers } from './hooks/useHandovers.js'
import HandoverCard from './components/HandoverCard.jsx'
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

  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'In Preparation', value: 'in_preparation' },
    { label: 'Verification', value: 'verification' },
    { label: 'Completed', value: 'completed' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Active Handovers
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Role-verified engineering continuity pipeline with zero orphan tasks.
          </p>
        </div>

        {canCreate && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New Handover
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400 flex items-center justify-between">
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
              statusFilter === opt.value
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content Body */}
      {loading ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center text-xs text-zinc-500">
          Loading active handovers...
        </div>
      ) : handovers.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No handovers found</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {canCreate
              ? 'Click "+ New Handover" to initiate a structured knowledge transfer between team engineers.'
              : 'You do not have any active handovers assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
