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
import RejectActionBox from './RejectActionBox.jsx'
import { getInitials, formatDate, getInviteUrl } from '../utils/formatters.js'

/**
 * Desktop table view for Access Requests
 */
export default function AccessRequestsDesktopTable({
  requests,
  actionLoadingId,
  confirmingRejectId,
  setConfirmingRejectId,
  confirmingApproveId,
  setConfirmingApproveId,
  copiedId,
  onCopy,
  onReview,
}) {
  return (
    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Requested on</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const inviteUrl = getInviteUrl(req._id, req.inviteUrl)
            return (
              <TableRow key={req._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 shadow-inner tracking-wider">
                      {getInitials(req.name, req.email)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{req.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">{req.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {req.requestedRole}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-400 font-mono text-xs">{formatDate(req.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
                <TableCell className="text-right">
                  {req.status === 'pending' ? (
                    confirmingRejectId === req._id ? (
                      <RejectActionBox
                        requestId={req._id}
                        req={req}
                        actionLoadingId={actionLoadingId}
                        onReview={onReview}
                        onCancel={() => setConfirmingRejectId(null)}
                        layout="desktop"
                      />
                    ) : confirmingApproveId === req._id ? (
                      <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-150">
                        <Button
                          size="sm"
                          variant="primary"
                          loading={actionLoadingId === req._id}
                          onClick={() => {
                            onReview(req._id, 'approve', req.requestedRole, '', req)
                            setConfirmingApproveId(null)
                          }}
                          className="text-[11px] px-2.5 py-1 flex items-center gap-1.5 shadow-sm"
                        >
                          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>Confirm Approve?</span>
                        </Button>
                        <button
                          type="button"
                          onClick={() => setConfirmingApproveId(null)}
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
                          onClick={() => {
                            setConfirmingRejectId(req._id)
                            setConfirmingApproveId(null)
                          }}
                          className="text-zinc-400 hover:text-white hover:bg-zinc-800/60 border-zinc-800 flex items-center gap-1.5 text-xs"
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
                          className="text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800 flex items-center gap-1.5 text-xs font-medium"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>Approve</span>
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-xs text-zinc-300">
                          <span className="text-zinc-500">by </span>
                          <span className="text-zinc-200 font-medium">
                            {req.reviewedBy?.fullName || req.reviewedBy?.email || 'Admin'}
                          </span>
                        </div>
                        {req.status === 'approved' && inviteUrl && (
                          <CopyInviteLink
                            inviteUrl={inviteUrl}
                            id={req._id}
                            isCopied={copiedId === req._id}
                            onCopy={onCopy}
                            variant="button"
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {formatDate(req.reviewedAt || req.updatedAt)}
                        {req.reviewNotes && (
                          <span className="text-zinc-400 ml-1.5 italic" title={req.reviewNotes}>
                            • "{req.reviewNotes.length > 25 ? `${req.reviewNotes.slice(0, 25)}…` : req.reviewNotes}"
                          </span>
                        )}
                      </div>
                    </div>
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
