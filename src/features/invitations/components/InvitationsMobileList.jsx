import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import { getInitials, formatDate, getInviteUrl, getActiveTimeRemaining } from '../utils/formatters.js'
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
  now = Date.now(),
}) {
  return (
    <div className="sm:hidden space-y-2.5">
      {invitations.map((inv) => {
        const inviteUrl = getInviteUrl(inv._id, inv.inviteUrl)
        const isPending = inv.status === INVITATION_STATUS.PENDING
        const activeTime = isPending ? getActiveTimeRemaining(inv.expiresAt, now) : null

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
                expiresAt={inv.expiresAt}
                isCopied={copiedId === inv._id}
                onCopy={onCopy}
                onRevoke={canInvite ? onRevoke : null}
                actionLoading={actionLoadingId === inv._id}
                variant="bar"
              />
            )}

            {/* Connected Inset Note Callout */}
            {inv.message && (
              <div className="px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-center gap-2 text-xs">
                <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <ExpandableNote note={inv.message} label="Invitation Note:" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
