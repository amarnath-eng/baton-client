import AccessRequestDesktopRow from './AccessRequestDesktopRow.jsx'

const EMPTY_MESSAGES = {
  pending: {
    title: 'No pending requests',
    description: 'There are currently no access requests waiting for review.',
  },
  approved: {
    title: 'No approved requests',
    description: 'Approved workspace access requests will appear here.',
  },
  rejected: {
    title: 'No rejected requests',
    description: 'Rejected workspace access requests will appear here.',
  },
  all: {
    title: 'No access requests',
    description: 'Incoming requests to join your company workspace will appear here.',
  },
}

/**
 * AccessRequestsDesktopTable orchestrator component.
 * Single Responsibility: Manages table structure, header definitions,
 * and delegates individual record rendering to AccessRequestDesktopRow.
 * Maintains a stable dark border palette and persistent frame to eliminate
 * any white line flashing or layout shifts across filter changes.
 */
export default function AccessRequestsDesktopTable({
  requests = [],
  filterStatus = 'all',
  actionLoadingId = null,
  confirmingRejectId = null,
  setConfirmingRejectId,
  confirmingApproveId = null,
  setConfirmingApproveId,
  confirmingRevokeId = null,
  setConfirmingRevokeId,
  copiedId = null,
  onCopy,
  onReview,
  onRevoke,
}) {
  const emptyInfo = EMPTY_MESSAGES[filterStatus] || EMPTY_MESSAGES.all

  return (
    <div className="hidden sm:block">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-sm">
        {/* Sleek Column Header Bar - Laser-Aligned Grid with stable dark borders */}
        <div className="grid grid-cols-[1.8fr_110px_2.2fr_120px_210px] items-center px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80 text-[11px] font-mono uppercase text-zinc-400 tracking-wider select-none gap-4">
          <div>Applicant</div>
          <div className="text-center">Role</div>
          <div className="text-center">Review Timeline</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows or Persistent Empty State */}
        {requests.length > 0 ? (
          <div>
            {requests.map((req) => (
              <AccessRequestDesktopRow
                key={req._id}
                req={req}
                actionLoadingId={actionLoadingId}
                confirmingRejectId={confirmingRejectId}
                setConfirmingRejectId={setConfirmingRejectId}
                confirmingApproveId={confirmingApproveId}
                setConfirmingApproveId={setConfirmingApproveId}
                confirmingRevokeId={confirmingRevokeId}
                setConfirmingRevokeId={setConfirmingRevokeId}
                copiedId={copiedId}
                onCopy={onCopy}
                onReview={onReview}
                onRevoke={onRevoke}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-1">
            <p className="text-xs font-medium text-zinc-300">{emptyInfo.title}</p>
            {emptyInfo.description && (
              <p className="text-[11px] text-zinc-500">{emptyInfo.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
