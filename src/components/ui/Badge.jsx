// Reusable status badge component with sleek dark zinc aesthetic
export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-zinc-900 text-zinc-300 border-zinc-800',
    zinc: 'bg-zinc-800/80 text-zinc-200 border-zinc-700',
    cyan: 'bg-zinc-900 text-zinc-200 border-zinc-700/80',
    indigo: 'bg-zinc-900 text-zinc-200 border-zinc-700/80',
    emerald: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50',
    amber: 'bg-amber-950/40 text-amber-400 border-amber-800/50',
    rose: 'bg-rose-950/40 text-rose-400 border-rose-800/50',
  }

  const selectedStyle = styles[variant] || styles.default

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide ${selectedStyle} ${className}`}
    >
      {children}
    </span>
  )
}
