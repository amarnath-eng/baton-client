export default function StatusBadge({ status }) {
  const configs = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    revoked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    expired: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  }

  const labelMap = {
    pending: 'Pending',
    approved: 'Approved',
    accepted: 'Accepted',
    rejected: 'Rejected',
    revoked: 'Revoked',
    expired: 'Expired',
  }

  const style = configs[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
  const label = labelMap[status] || status

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${style}`}
    >
      {label}
    </span>
  )
}
