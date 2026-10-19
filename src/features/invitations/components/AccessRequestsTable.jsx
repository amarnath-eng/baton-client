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

export default function AccessRequestsTable({
  requests = [],
  loading = false,
  actionLoadingId = null,
  onReview,
}) {
  const [confirmingRejectId, setConfirmingRejectId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  function formatDate(isoDate) {
    if (!isoDate) return '—'
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return <TableLoading message="Loading access requests..." />
  }

  if (requests.length === 0) {
    return (
      <TableEmpty
        title="No access requests"
        description="Incoming requests to join your company workspace will appear here."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Requested Role</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req._id}>
            <TableCell>
              <div className="font-medium text-white">{req.name}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{req.email}</div>
            </TableCell>
            <TableCell className="capitalize">{req.requestedRole}</TableCell>
            <TableCell className="text-zinc-400">{formatDate(req.createdAt)}</TableCell>
            <TableCell>
              <StatusBadge status={req.status} />
            </TableCell>
            <TableCell className="text-right">
              {req.status === 'pending' ? (
                confirmingRejectId === req._id ? (
                  <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-150">
                    <input
                      type="text"
                      placeholder="Rejection note (optional)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none w-48"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionLoadingId === req._id}
                      onClick={() => {
                        onReview(req._id, 'reject', null, rejectReason)
                        setConfirmingRejectId(null)
                        setRejectReason('')
                      }}
                      className="bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border-rose-500/40 text-[11px] px-2.5 py-1"
                    >
                      Confirm?
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingRejectId(null)
                        setRejectReason('')
                      }}
                      className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition cursor-pointer text-xs"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionLoadingId === req._id}
                      onClick={() => setConfirmingRejectId(req._id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      loading={actionLoadingId === req._id}
                      onClick={() => onReview(req._id, 'approve', req.requestedRole)}
                    >
                      Approve
                    </Button>
                  </div>
                )
              ) : (
                <span className="text-[11px] text-zinc-500 italic">Reviewed</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
