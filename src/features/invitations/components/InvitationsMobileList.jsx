import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'
import { INVITATION_STATUS } from '../../../constants/invitations.js'

/**
 * Mobile card list view for Sent Invitations
 */
export default function InvitationsMobileList({
  invitations,
  canInvite,
  actionLoadingId,
  confirmingRevokeId,
  setConfirmingRevokeId,
  copiedId,
  onCopy,
  onRevoke,
}) {
  return (
    <div className="sm:hidden space-y-2.5">
      {invitations.map((inv) => {
        const inviteUrl = getInviteUrl(inv._id, inv.inviteUrl)
        return (
          <div
            key={inv._id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2.5 shadow-sm"
          >
            {/* Header: Identity & Status */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 tracking-wider">
                  {getInitials(inv.name, inv.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-white tracking-tight truncate">
                    {inv.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    {inv.email}
                  </p>
                </div>
              </div>
              <StatusBadge status={inv.status} />
            </div>

            {/* Pattern 1: Linear-style Key-Value Metric Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-zinc-900 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Role
                </span>
                <span className="font-semibold text-zinc-200 capitalize font-mono text-[11px]">
                  {inv.role}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Invited by
                </span>
                <span className="text-zinc-200 font-medium truncate block text-[11px]">
                  {inv.invitedBy?.fullName || 'Workspace Admin'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Dispatched on
                </span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {formatDate(inv.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider block">
                  Expires on
                </span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {formatDate(inv.expiresAt)}
                </span>
              </div>
            </div>

            {/* Generated Invite Link (Available for copying directly) */}
            {inv.status === INVITATION_STATUS.PENDING && inviteUrl && (
              <CopyInviteLink
                inviteUrl={inviteUrl}
                id={inv._id}
                isCopied={copiedId === inv._id}
                onCopy={onCopy}
                variant="bar"
              />
            )}

            {/* Note / Message (Below invite link, single line with read more / collapse) */}
            {inv.message && (
              <ExpandableNote note={inv.message} />
            )}

            {/* Actions for Pending Invitations */}
            {inv.status === INVITATION_STATUS.PENDING && canInvite && (
              <div className="pt-2 border-t border-zinc-900">
                {confirmingRevokeId === inv._id ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={actionLoadingId === inv._id}
                      onClick={() => {
                        onRevoke(inv._id)
                        setConfirmingRevokeId(null)
                      }}
                      className="flex-1 text-xs py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border-zinc-700 font-medium"
                    >
                      Confirm Revoke?
                    </Button>
                    <button
                      type="button"
                      onClick={() => setConfirmingRevokeId(null)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={actionLoadingId === inv._id}
                    onClick={() => setConfirmingRevokeId(inv._id)}
                    className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 border-zinc-800 text-xs py-1.5"
                  >
                    Revoke Invitation
                  </Button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
