import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import RejectActionBox from './RejectActionBox.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'
import { ACCESS_REQUEST_STATUS } from '../../../constants/accessRequests.js'

/**
 * Single Responsibility: Renders an individual Access Request row on Desktop
 * with its identity, timeline, status, inline actions, and review callouts.
 */
export default function AccessRequestDesktopRow({
  req,
  actionLoadingId,
  confirmingRejectId,
  setConfirmingRejectId,
  confirmingApproveId,
  setConfirmingApproveId,
  copiedId,
  onCopy,
  onReview,
}) {
  const inviteUrl = getInviteUrl(req._id, req.inviteUrl)
  const isPending = req.status === ACCESS_REQUEST_STATUS.PENDING
  const isApproved = req.status === ACCESS_REQUEST_STATUS.APPROVED
  const isRejecting = confirmingRejectId === req._id
  const isApproving = confirmingApproveId === req._id

  return (
    <div
      className={`transition-all duration-200 ${
        isRejecting || isApproving ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/35'
      }`}
    >
      {/* Primary Row Grid */}
      <div className="grid grid-cols-[1.8fr_110px_2.2fr_120px_190px] items-center px-4 py-3.5 gap-4">
        {/* Column 1: Applicant Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 tracking-wider shadow-inner">
            {getInitials(req.name, req.email)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white tracking-tight truncate">
              {req.name}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono truncate">
              {req.email}
            </div>
          </div>
        </div>

        {/* Column 2: Role */}
        <div className="font-mono text-xs text-zinc-300 tracking-wide uppercase text-center">
          {req.requestedRole}
        </div>

        {/* Column 3: Timeline & Review */}
        <div className="flex justify-center">
          <div className="text-xs space-y-1.5 text-left inline-flex flex-col">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-18 text-zinc-500 text-[10px] uppercase tracking-wider font-medium shrink-0">
                Requested:
              </span>
              <span className="text-zinc-300">{formatDate(req.createdAt)}</span>
            </div>

            {req.status !== ACCESS_REQUEST_STATUS.PENDING ? (
              <div className="flex items-center gap-1.5 font-mono text-[11px] truncate">
                <span className="w-18 text-zinc-500 text-[10px] uppercase tracking-wider font-medium shrink-0">
                  Reviewed:
                </span>
                <span className="text-zinc-200 font-medium truncate">
                  {req.reviewedBy?.fullName || req.reviewedBy?.email || 'Admin'}
                </span>
                <span className="text-zinc-600 shrink-0">·</span>
                <span className="text-zinc-400 shrink-0">
                  {formatDate(req.reviewedAt || req.updatedAt)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-18 text-zinc-500 text-[10px] uppercase tracking-wider font-medium shrink-0">
                  Status:
                </span>
                <span className="text-zinc-500">Awaiting review</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Status Badge */}
        <div className="flex justify-center">
          <StatusBadge status={req.status} />
        </div>

        {/* Column 5: Decision / Actions */}
        <div className="flex items-center justify-end gap-2">
          {isPending ? (
            isApproving ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <Button
                  size="sm"
                  variant="primary"
                  loading={actionLoadingId === req._id}
                  onClick={() => {
                    onReview(req._id, 'approve', req.requestedRole, '', req)
                    setConfirmingApproveId(null)
                  }}
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Confirm Approve?</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirmingApproveId(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition cursor-pointer text-xs"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  loading={actionLoadingId === req._id}
                  onClick={() => {
                    setConfirmingRejectId(req._id)
                    setConfirmingApproveId(null)
                  }}
                  className="text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 border-zinc-800 text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
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
                  className="text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-xs py-1.5 px-3 flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Approve</span>
                </Button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2.5">
              {isApproved && inviteUrl && (
                <CopyInviteLink
                  inviteUrl={inviteUrl}
                  id={req._id}
                  isCopied={copiedId === req._id}
                  onCopy={onCopy}
                  variant="button"
                />
              )}
              {!isApproved && (
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Resolved
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connected Inset Review Note Callout */}
      {req.reviewNotes && !isRejecting && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-2.5 text-xs">
          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="flex-1 min-w-0">
            <ExpandableNote note={req.reviewNotes} label="Review Feedback:" />
          </div>
        </div>
      )}

      {/* Inline Rejection Drawer */}
      {isRejecting && (
        <div className="px-5 py-3.5 bg-zinc-900/80 border-t border-zinc-800/80 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-xs text-zinc-400 mb-2 font-medium">
            Provide feedback or context for declining <span className="text-white font-semibold">{req.name}</span>'s request:
          </p>
          <RejectActionBox
            requestId={req._id}
            req={req}
            actionLoadingId={actionLoadingId}
            onReview={onReview}
            onCancel={() => setConfirmingRejectId(null)}
            layout="mobile"
          />
        </div>
      )}
    </div>
  )
}
