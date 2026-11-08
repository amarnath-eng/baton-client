import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import ExpandableNote from './ExpandableNote.jsx'
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'
import { INVITATION_STATUS } from '../../../constants/invitations.js'

/**
 * Desktop table view for Sent Invitations.
 * Uses a stable laser-aligned grid within a persistent rounded-xl container
 * to eliminate top and header-bottom border gaps during vertical movement.
 */
export default function InvitationsDesktopTable({
  invitations,
  canInvite,
  actionLoadingId,
  confirmingRevokeId,
  setConfirmingRevokeId,
  copiedId,
  onCopy,
  onRevoke,
  onReinvite,
}) {
  return (
    <div className="hidden sm:block">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-sm">
        {/* Sleek Column Header Bar - Laser-Aligned Grid with stable dark borders */}
        <div className="grid grid-cols-[1.8fr_110px_1.5fr_120px_120px_180px] items-center px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80 text-[11px] font-mono uppercase text-zinc-400 tracking-wider select-none gap-4">
          <div className="min-w-0">Invited Member</div>
          <div className="text-center">Role</div>
          <div className="min-w-0">Invited By</div>
          <div className="min-w-0">Expires</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div>
          {invitations.map((inv) => {
            const inviteUrl = getInviteUrl(inv._id, inv.inviteUrl)

            return (
              <div
                key={inv._id}
                className="border-b border-zinc-800/60 last:border-b-0 hover:bg-zinc-900/35 transition-colors duration-150"
              >
                {/* Primary Row Grid */}
                <div className="grid grid-cols-[1.8fr_110px_1.5fr_120px_120px_180px] items-center px-4 py-3.5 gap-4">
                  {/* Column 1: Identity & Employee ID */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 shadow-inner tracking-wider">
                      {getInitials(inv.name, inv.email)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm font-semibold text-white tracking-[0.025em] truncate">
                          {inv.name}
                        </span>
                        {inv.employeeId && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0 font-medium tracking-wider">
                            {inv.employeeId}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 tracking-[0.02em] truncate">
                        {inv.email}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Role */}
                  <div className="flex justify-center">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {inv.role}
                    </span>
                  </div>

                  {/* Column 3: Invited By */}
                  <div className="text-zinc-300 text-xs truncate min-w-0">
                    {inv.invitedBy?.fullName || 'Workspace Admin'}
                  </div>

                  {/* Column 4: Expiration */}
                  <div className="text-zinc-400 font-mono text-xs truncate min-w-0">
                    {formatDate(inv.expiresAt)}
                  </div>

                  {/* Column 5: Status Badge */}
                  <div className="flex justify-center">
                    <StatusBadge status={inv.status} />
                  </div>

                  {/* Column 6: Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {inv.status === INVITATION_STATUS.PENDING ? (
                      canInvite ? (
                        confirmingRevokeId === inv._id ? (
                          <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-150">
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={actionLoadingId === inv._id}
                              onClick={() => {
                                onRevoke(inv._id)
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
                          <div className="flex items-center justify-end gap-2">
                            {inviteUrl && (
                              <CopyInviteLink
                                inviteUrl={inviteUrl}
                                id={inv._id}
                                expiresAt={inv.expiresAt}
                                isCopied={copiedId === inv._id}
                                onCopy={onCopy}
                                variant="button"
                              />
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              loading={actionLoadingId === inv._id}
                              onClick={() => setConfirmingRevokeId(inv._id)}
                              className="text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20 text-xs py-1 cursor-pointer"
                            >
                              Revoke
                            </Button>
                          </div>
                        )
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-500">Awaiting response</span>
                      )
                    ) : inv.status === INVITATION_STATUS.REVOKED ? (
                      canInvite ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReinvite?.(inv)}
                            className="text-xs py-1 px-2.5 border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Re-invite</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-500">Revoked</span>
                      )
                    ) : inv.status === INVITATION_STATUS.ACCEPTED ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-medium">
                        <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Joined Workspace</span>
                      </span>
                    ) : inv.status === INVITATION_STATUS.EXPIRED ? (
                      canInvite ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReinvite?.(inv)}
                            className="text-xs py-1 px-2.5 border-zinc-700/80 hover:bg-zinc-800 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Re-invite</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-amber-500/80">Expired</span>
                      )
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-500">Resolved</span>
                    )}
                  </div>
                </div>

                {/* Connected Inset Note Callout */}
                {inv.message && (
                  <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2.5 text-xs">
                    <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </div>
  )
}
