export default function StatusBadge({ status }) {
  const configs = {
    pending: {
      style: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      dot: 'bg-amber-400',
    },
    approved: {
      style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    accepted: {
      style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    rejected: {
      style: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      dot: 'bg-rose-400',
    },
    revoked: {
      style: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      dot: 'bg-rose-400',
    },
    expired: {
      style: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
      dot: 'bg-zinc-500',
    },
  }

  const labelMap = {
    pending: 'Pending',
    approved: 'Approved',
    accepted: 'Accepted',
    rejected: 'Rejected',
    revoked: 'Revoked',
    expired: 'Expired',
  }

  const config = configs[status] || {
    style: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    dot: 'bg-zinc-500',
  }
  const label = labelMap[status] || status

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shadow-xs ${config.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{label}</span>
    </span>
  )
}
