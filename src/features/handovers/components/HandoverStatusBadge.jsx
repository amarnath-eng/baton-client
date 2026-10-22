export default function HandoverStatusBadge({ status }) {
  const configs = {
    draft: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    in_preparation: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    submitted_for_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    revision_requested: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    verification: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    ready_for_acknowledgement: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  }

  const labelMap = {
    draft: 'Draft',
    in_preparation: 'In Preparation',
    submitted_for_review: 'Submitted for Review',
    revision_requested: 'Revision Requested',
    verification: 'Verification',
    ready_for_acknowledgement: 'Ready for Sign-off',
    completed: 'Completed',
  }

  const style = configs[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
  const label = labelMap[status] || status?.replace(/_/g, ' ')

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${style}`}
    >
      {label}
    </span>
  )
}
