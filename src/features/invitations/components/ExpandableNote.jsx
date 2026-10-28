import { useState, useRef, useEffect } from 'react'

/**
 * ExpandableNote component with container-width overflow detection
 * and industry-standard "Show more" / "Show less" toggling.
 */
export default function ExpandableNote({ note, label = 'Note:' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const textRef = useRef(null)

  if (!note || !note.trim()) return null
  const trimmed = note.trim()

  useEffect(() => {
    const el = textRef.current
    if (el) {
      // Check if text content physically overflows the available container width
      setHasOverflow(el.scrollWidth > el.clientWidth)
    }
  }, [trimmed])

  return (
    <div
      className={`text-[11px] text-zinc-400 leading-normal min-w-0 flex ${
        isExpanded ? 'items-start' : 'items-center'
      } gap-1.5`}
    >
      {label && (
        <span className="font-semibold text-zinc-400 shrink-0 font-mono text-[10px] uppercase tracking-wider">
          {label}
        </span>
      )}

      <span
        ref={textRef}
        className={`text-zinc-300 italic min-w-0 ${
          isExpanded ? 'break-words whitespace-normal' : 'truncate'
        }`}
        title={!isExpanded ? trimmed : undefined}
      >
        "{trimmed}"
      </span>

      {(hasOverflow || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-zinc-400 hover:text-white font-medium text-[10px] shrink-0 hover:underline cursor-pointer transition-colors ml-1 font-mono select-none"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

