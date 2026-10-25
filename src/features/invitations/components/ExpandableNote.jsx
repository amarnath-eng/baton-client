import { useState } from 'react'

/**
 * ExpandableNote component with safe overflow wrapping and read more / collapse toggle
 */
export default function ExpandableNote({ note, maxChars = 48 }) {
  const [isExpanded, setIsExpanded] = useState(false)
  if (!note || !note.trim()) return null

  const trimmed = note.trim()
  const isLong = trimmed.length > maxChars

  return (
    <div className="text-[11px] text-zinc-400 leading-snug min-w-0 break-words [overflow-wrap:anywhere]">
      <span className="font-medium text-zinc-500">Note: </span>
      <span className="text-zinc-300 italic break-words [overflow-wrap:anywhere]">
        "{!isExpanded && isLong ? `${trimmed.slice(0, maxChars)}…` : trimmed}"
      </span>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-block ml-1 text-zinc-400 hover:text-white underline font-medium cursor-pointer not-italic text-[10px] whitespace-nowrap"
        >
          {isExpanded ? 'collapse' : 'read more'}
        </button>
      )}
    </div>
  )
}
