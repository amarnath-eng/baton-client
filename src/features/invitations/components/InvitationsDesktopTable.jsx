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
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'

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
                <TableCell className="text-zinc-400 font-mono text-xs">{formatDate(inv.expiresAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right">
                  {inv.status === 'pending' && canInvite ? (
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
                          className="text-[11px] px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border-zinc-700 font-medium"
                        >
                          Confirm?
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
                          <button
                            type="button"
                            onClick={() => onCopy(inviteUrl, inv._id)}
                            className="text-[11px] font-medium text-zinc-300 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5"
                            title="Copy 7-day invitation link"
                          >
                            {copiedId === inv._id ? (
                              <span className="text-emerald-400 font-semibold">✓ Copied</span>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          loading={actionLoadingId === inv._id}
                          onClick={() => setConfirmingRevokeId(inv._id)}
                          className="text-zinc-400 hover:text-white hover:bg-zinc-800/60 border-zinc-800"
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
