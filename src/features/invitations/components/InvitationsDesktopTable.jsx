import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/Table.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import CopyInviteLink from './CopyInviteLink.jsx'
import { getInitials, formatDate, getInviteUrl, getActiveTimeRemaining } from '../utils/formatters.js'
import { INVITATION_STATUS } from '../../../constants/invitations.js'

/**
 * Desktop table view for Sent Invitations
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
  now = Date.now(),
}) {
  return (
    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invited Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((inv) => {
            const inviteUrl = getInviteUrl(inv._id, inv.inviteUrl)

            return (
              <TableRow key={inv._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 shadow-inner tracking-wider">
                      {getInitials(inv.name, inv.email)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{inv.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">{inv.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {inv.role}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-300 text-xs">
                  {inv.invitedBy?.fullName || 'Workspace Admin'}
                </TableCell>
                <TableCell className="text-zinc-400 font-mono text-xs">
                  {formatDate(inv.expiresAt)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right">
                  {inv.status === INVITATION_STATUS.PENDING && canInvite ? (
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
                          className="text-[11px] px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border-rose-500/40 font-medium"
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
                          className="text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20 text-xs py-1"
                        >
                          Revoke
                        </Button>
                      </div>
                    )
                  ) : (
                    <span className="text-[11px] text-zinc-500">—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
