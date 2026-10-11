// Reusable container card with dark charcoal surface and hairline border
export function Card({ children, className = '', hover = false }) {
  const hoverStyles = hover
    ? 'hover:border-zinc-700 hover:bg-[#121215] transition-all duration-200'
    : ''

  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-[#0c0c0e] p-6 backdrop-blur-sm ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  )
}
