import { HANDOVER_STATUS_COLORS, HANDOVER_STATUS_LABELS } from '../../../constants/handover'

export default function HandoverStatusBadge({ status }) {
  const style = HANDOVER_STATUS_COLORS[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
  const label = HANDOVER_STATUS_LABELS[status] || status?.replace(/_/g, ' ')

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${style}`}
    >
      {label}
    </span>
  )
}
