import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableLoading,
  TableEmpty,
} from '../../../components/ui/Table.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'

export default function InvitationsTable({
  invitations = [],
  loading = false,
  actionLoadingId = null,
  canInvite = false,
  onRevoke,
}) {
  const [confirmingRevokeId, setConfirmingRevokeId] = useState(null)

  function formatDate(isoDate) {
    if (!isoDate) return '—'
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return <TableLoading message="Loading invitations..." />
  }

  if (invitations.length === 0) {
    return (
      <TableEmpty
        title="No sent invitations"
        description="Dispatched 7-day cryptographic team invitations will appear here."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invited Member</TableHead>
          <TableHead>Assigned Role</TableHead>
          <TableHead>Invited By</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((inv) => (
          <TableRow key={inv._id}>
            <TableCell>
              <div className="font-medium text-white">{inv.name}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{inv.email}</div>
            </TableCell>
            <TableCell className="capitalize">{inv.role}</TableCell>
            <TableCell className="text-zinc-400">
              {inv.invitedBy?.fullName || 'Workspace Admin'}
            </TableCell>
            <TableCell className="text-zinc-400">{formatDate(inv.expiresAt)}</TableCell>
            <TableCell>
              <StatusBadge status={inv.status} />
            </TableCell>
            <TableCell className="text-right">
              {inv.status === 'pending' && canInvite ? (
                confirmingRevokeId === inv._id ? (
                  <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-150">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionLoadingId === inv._id}
                      onClick={() => {
                        onRevoke(inv._id)
                        setConfirmingRevokeId(null)
                      }}
                      className="bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border-rose-500/40 text-[11px] px-2.5 py-1"
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
                  <Button
                    size="sm"
                    variant="outline"
                    loading={actionLoadingId === inv._id}
                    onClick={() => setConfirmingRevokeId(inv._id)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20"
                  >
                    Revoke
                  </Button>
                )
              ) : (
                <span className="text-[11px] text-zinc-500">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
