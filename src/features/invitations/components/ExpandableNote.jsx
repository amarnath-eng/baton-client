import { useState, useRef, useEffect } from 'react'

/**
 * ExpandableNote component with one-line default truncation,
 * inline "Read more" placement right after line one ending,
 * and multiline "Read less" toggling.
 */
export default function ExpandableNote({ note, label = 'Note:' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef(null)

  if (!note || !note.trim()) return null
  const trimmed = note.trim()
  const hasMultipleLines = trimmed.includes('\n')

  useEffect(() => {
    const el = textRef.current
    if (el) {
      // Overflows if it contains newlines, or horizontal text exceeds single-line container
      setIsOverflowing(hasMultipleLines || el.scrollWidth > el.clientWidth)
    }
  }, [trimmed, hasMultipleLines])

  // When collapsed and has multiple lines, show the first line only
  const firstLine = hasMultipleLines ? trimmed.split('\n')[0] : trimmed
  const displayContent = !isExpanded && hasMultipleLines ? firstLine : trimmed

  return (
    <div className="text-[11px] text-zinc-400 leading-relaxed min-w-0">
      {label && (
        <span className="font-semibold text-zinc-400 font-mono text-[10px] uppercase tracking-wider select-none mr-1.5 align-baseline">
          {label}
        </span>
      )}

      <span
        ref={textRef}
        className={`text-zinc-300 italic align-baseline ${
          isExpanded
            ? 'whitespace-pre-line break-words'
            : 'inline-block max-w-[calc(100%-110px)] truncate align-bottom'
        }`}
        title={!isExpanded ? trimmed : undefined}
      >
        "{displayContent}"
      </span>

      {(isOverflowing || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-zinc-400 hover:text-white font-medium text-[11px] hover:underline cursor-pointer transition-colors ml-1.5 select-none whitespace-nowrap inline-flex items-center align-baseline font-mono"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
