import { Button } from '../../../components/ui/Button.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'

/**
 * Single Responsibility: Renders the action buttons for an Access Request row:
 * - Pending: Approve, Reject, Confirm Approve
 * - Approved: Copy Link, Revoke, Joined badge, Revoked badge
 * - Resolved: Status label
 */
export default function AccessRequestActionButtons({
  req,
  isPending,
  isApproved,
  isApproving,
  isRejecting,
  isInvitePending,
  inviteUrl,
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
  if (isPending) {
    if (isApproving) {
      return (
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
      )
    }

    if (isRejecting) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>Declining...</span>
        </span>
      )
    }

    return (
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
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      {isApproved ? (
        <>
          {inviteUrl && isInvitePending && (
            <CopyInviteLink
              inviteUrl={inviteUrl}
              id={req._id}
              expiresAt={req.invitationId?.expiresAt}
              isCopied={copiedId === req._id}
              onCopy={onCopy}
              variant="button"
            />
          )}

          {isInvitePending && (
            confirmingRevokeId === req._id ? (
              <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                <Button
                  size="sm"
                  variant="secondary"
                  loading={actionLoadingId === req._id || actionLoadingId === req.invitationId?._id}
                  onClick={() => {
                    const targetId = req.invitationId?._id || req.invitationId || req._id
                    onRevoke(targetId)
                    setConfirmingRevokeId(null)
                  }}
                  className="text-[11px] px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border-rose-500/40 font-medium cursor-pointer"
                >
                  Confirm Revoke?
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirmingRevokeId(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition cursor-pointer text-xs"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                loading={actionLoadingId === req._id || actionLoadingId === req.invitationId?._id}
                onClick={() => {
                  setConfirmingRevokeId(req._id)
                  setConfirmingApproveId(null)
                  setConfirmingRejectId(null)
                }}
                className="text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20 text-xs py-1 px-2.5 cursor-pointer"
              >
                Revoke
              </Button>
            )
          )}

          {!isInvitePending && req.invitationId?.status === 'accepted' && (
            <span className="text-[11px] font-mono text-emerald-400 font-medium">
              Joined
            </span>
          )}

          {!isInvitePending && req.invitationId?.status === 'revoked' && (
            <span className="text-[11px] font-mono text-zinc-500">
              Revoked
            </span>
          )}
        </>
      ) : (
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          Resolved
        </span>
      )}
    </div>
  )
}

