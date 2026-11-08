import AccessRequestDesktopRow from './AccessRequestDesktopRow.jsx'

/**
 * AccessRequestsDesktopTable orchestrator component.
 * Single Responsibility: Manages table structure, header definitions,
 * and delegates individual record rendering to AccessRequestDesktopRow.
 */
export default function AccessRequestsDesktopTable({
  requests = [],
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
  return (
    <div className="hidden sm:block">
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-sm">
        {/* Sleek Column Header Bar - Laser-Aligned Grid */}
        <div className="grid grid-cols-[1.8fr_110px_2.2fr_120px_210px] items-center px-4 py-3 bg-zinc-900/50 border-b border-white/[0.06] text-[11px] font-mono uppercase text-zinc-400 tracking-wider select-none gap-4">
          <div>Applicant</div>
          <div className="text-center">Role</div>
          <div className="text-center">Review Timeline</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows - Delegated to AccessRequestDesktopRow */}
        <div className="divide-y divide-zinc-800/60">
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
      </div>
    </div>
  )
}
