import { INVITATION_STATUS } from '../../../constants/invitations.js'
import { ACCESS_REQUEST_STATUS } from '../../../constants/accessRequests.js'

export default function StatusBadge({ status }) {
  const configs = {
    [ACCESS_REQUEST_STATUS.PENDING]: {
      style: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      dot: 'bg-amber-400',
    },
    [ACCESS_REQUEST_STATUS.APPROVED]: {
      style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    [INVITATION_STATUS.ACCEPTED]: {
      style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    [ACCESS_REQUEST_STATUS.REJECTED]: {
      style: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      dot: 'bg-rose-400',
    },
    [INVITATION_STATUS.REVOKED]: {
      style: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      dot: 'bg-rose-400',
    },
    [INVITATION_STATUS.EXPIRED]: {
      style: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
      dot: 'bg-zinc-500',
    },
  }

  const labelMap = {
    [ACCESS_REQUEST_STATUS.PENDING]: 'Pending',
    [ACCESS_REQUEST_STATUS.APPROVED]: 'Approved',
    [INVITATION_STATUS.ACCEPTED]: 'Accepted',
    [ACCESS_REQUEST_STATUS.REJECTED]: 'Rejected',
    [INVITATION_STATUS.REVOKED]: 'Revoked',
    [INVITATION_STATUS.EXPIRED]: 'Expired',
  }

  const config = configs[status] || {
    style: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    dot: 'bg-zinc-500',
  }
  const label = labelMap[status] || status

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label}
    </span>
  )
}
