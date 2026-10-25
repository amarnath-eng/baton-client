import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import RejectActionBox from './RejectActionBox.jsx'
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'

/**
 * Mobile card list view for Access Requests
 */
export default function AccessRequestsMobileList({
  requests,
  actionLoadingId,
  confirmingRejectId,
  setConfirmingRejectId,
  confirmingApproveId,
  setConfirmingApproveId,
  copiedId,
  onCopy,
  onReview,
}) {
  return (
    <div className="sm:hidden space-y-2.5">
      {requests.map((req) => {
        const inviteUrl = getInviteUrl(req._id, req.inviteUrl)
        return (
          <div
            key={req._id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2.5 shadow-sm"
          >
            {/* Header: Identity & Status */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 tracking-wider">
                  {getInitials(req.name, req.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-white tracking-tight truncate">
                    {req.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    {req.email}
                  </p>
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>

            {/* Pattern 1: Linear-style Key-Value Metric Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-zinc-900 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Requested Role
                </span>
                <span className="font-semibold text-zinc-200 capitalize font-mono text-[11px]">
                  {req.requestedRole}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Requested on
                </span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {formatDate(req.createdAt)}
                </span>
              </div>

              {req.status !== 'pending' && (
                <>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                      Reviewed by
                    </span>
                    <span className="text-zinc-200 font-medium truncate block text-[11px]">
                      {req.reviewedBy?.fullName || req.reviewedBy?.email || 'Workspace Admin'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                      Reviewed on
                    </span>
                    <span className="text-zinc-300 font-mono text-[11px]">
                      {formatDate(req.reviewedAt || req.updatedAt)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Generated Invite Link (Available for copying directly) */}
            {req.status === 'approved' && inviteUrl && (
              <CopyInviteLink
                inviteUrl={inviteUrl}
                id={req._id}
                isCopied={copiedId === req._id}
                onCopy={onCopy}
                variant="bar"
              />
            )}

            {/* Note (Below invite link, single line with read more / collapse) */}
            {req.reviewNotes && (
              <ExpandableNote note={req.reviewNotes} />
            )}

            {/* Actions for Pending Requests */}
            {req.status === 'pending' && (
              <div className="pt-2 border-t border-zinc-900">
                {confirmingRejectId === req._id ? (
                  <RejectActionBox
                    requestId={req._id}
                    req={req}
                    actionLoadingId={actionLoadingId}
                    onReview={onReview}
                    onCancel={() => setConfirmingRejectId(null)}
                    layout="mobile"
                  />
                ) : confirmingApproveId === req._id ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <Button
                      size="sm"
                      variant="primary"
                      loading={actionLoadingId === req._id}
                      onClick={() => {
                        onReview(req._id, 'approve', req.requestedRole, '', req)
                        setConfirmingApproveId(null)
                      }}
                      className="flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Confirm Approve?</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => setConfirmingApproveId(null)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionLoadingId === req._id}
                      onClick={() => {
                        setConfirmingRejectId(req._id)
                        setConfirmingApproveId(null)
                      }}
                      className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 border-zinc-800 text-xs py-1.5 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={actionLoadingId === req._id}
                      onClick={() => {
                        setConfirmingApproveId(req._id)
                        setConfirmingRejectId(null)
                      }}
                      className="w-full text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-xs py-1.5 flex items-center justify-center gap-1.5 font-medium"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>Approve</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
