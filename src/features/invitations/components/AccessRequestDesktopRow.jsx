import StatusBadge from './StatusBadge.jsx'
import AccessRequestActionButtons from './AccessRequestActionButtons.jsx'
import RejectActionBox from './RejectActionBox.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import { getInitials, formatDate, getInviteUrl, getActiveTimeRemaining } from '../utils/formatters.js'
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
  confirmingRevokeId,
  setConfirmingRevokeId,
  copiedId,
  onCopy,
  onReview,
  onRevoke,
}) {
  const inviteUrl = getInviteUrl(req._id, req.inviteUrl)
  const isPending = req.status === ACCESS_REQUEST_STATUS.PENDING
  const isApproved = req.status === ACCESS_REQUEST_STATUS.APPROVED
  const isRejecting = isPending && confirmingRejectId === req._id
  const isApproving = isPending && confirmingApproveId === req._id
  const isInvitePending = isApproved && (req.invitationId?.status === 'pending' || !req.invitationId?.status || typeof req.invitationId === 'string')

  return (
    <div
      className={`border-b border-zinc-800/60 last:border-b-0 transition-colors duration-150 ${
        isRejecting || isApproving ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/35'
      }`}
    >
      {/* Primary Row Grid */}
      <div className="grid grid-cols-[1.8fr_110px_2.2fr_120px_210px] items-center px-4 py-3.5 gap-4">
        {/* Column 1: Applicant Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 tracking-wider shadow-inner">
            {getInitials(req.name, req.email)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm font-semibold text-white tracking-[0.025em] truncate">
                {req.name}
              </span>
              {req.employeeId && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0 font-medium tracking-wider">
                  {req.employeeId}
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-400 tracking-[0.02em] truncate">
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
        <AccessRequestActionButtons
          req={req}
          isPending={isPending}
          isApproved={isApproved}
          isApproving={isApproving}
          isRejecting={isRejecting}
          isInvitePending={isInvitePending}
          inviteUrl={inviteUrl}
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
      </div>

      {/* Connected Inset Review Note Callout */}
      {req.reviewNotes && !isRejecting && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2.5 text-xs">
          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="flex-1 min-w-0">
            <ExpandableNote note={req.reviewNotes} label="Review Feedback:" />
          </div>
        </div>
      )}

      {/* Inline Rejection Drawer: Long note with buttons on the right side */}
      {isRejecting && (
        <div className="px-5 py-3 bg-zinc-900/90 border-t border-zinc-800/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-xs text-zinc-400 font-medium">
            Provide feedback or context for declining <span className="text-white font-semibold">{req.name}</span>'s request:
          </p>
          <RejectActionBox
            requestId={req._id}
            req={req}
            actionLoadingId={actionLoadingId}
            onReview={onReview}
            onCancel={() => setConfirmingRejectId(null)}
            layout="desktop"
          />
        </div>
      )}
    </div>
  )
}
