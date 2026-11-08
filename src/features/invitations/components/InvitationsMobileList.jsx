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
  onReinvite,
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
                  <div className="flex items-center gap-1.5 truncate">
                    <h3 className="text-sm font-semibold text-white tracking-[0.025em] truncate">
                      {inv.name}
                    </h3>
                    {inv.employeeId && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0 font-medium tracking-wider">
                        {inv.employeeId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 tracking-[0.02em] truncate">
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

            {/* Resolved Actions on Mobile */}
            {canInvite && (inv.status === INVITATION_STATUS.REVOKED || inv.status === INVITATION_STATUS.EXPIRED) && (
              <div className="pt-2 border-t border-zinc-900 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReinvite?.(inv)}
                  className="text-xs py-1 px-3 border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Re-invite Member</span>
                </Button>
              </div>
            )}

            {inv.status === INVITATION_STATUS.ACCEPTED && (
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-end gap-1.5 text-[11px] font-mono text-emerald-400 font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Joined Workspace</span>
              </div>
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
