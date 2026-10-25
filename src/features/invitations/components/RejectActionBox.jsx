import { useState, useRef, useEffect } from 'react'
import { Button } from '../../../components/ui/Button.jsx'

/**
 * Isolated rejection form with zero-latency auto-resizing textarea
 */
export default function RejectActionBox({
  requestId,
  req,
  actionLoadingId,
  onReview,
  onCancel,
  layout = 'mobile',
}) {
  const [reason, setReason] = useState('')
  const textareaRef = useRef(null)

  const handleInput = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    setReason(el.value)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [])

  if (layout === 'desktop') {
    return (
      <div className="flex flex-col items-end gap-1.5 animate-in fade-in duration-100">
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={handleInput}
          placeholder="Rejection note (optional)"
          rows={1}
          className="w-56 sm:w-64 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none min-h-[32px] leading-relaxed resize-none overflow-y-auto break-all scrollbar-thin"
        />
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            loading={actionLoadingId === requestId}
            onClick={() => onReview(requestId, 'reject', null, reason, req)}
            className="text-[11px] px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border-zinc-700 font-medium"
          >
            Confirm?
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition cursor-pointer text-xs"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-100">
      <textarea
        ref={textareaRef}
        value={reason}
        onChange={handleInput}
        placeholder="Rejection note (optional)"
        rows={1}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none min-h-[34px] leading-relaxed resize-none overflow-y-auto break-all scrollbar-thin"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          loading={actionLoadingId === requestId}
          onClick={() => onReview(requestId, 'reject', null, reason, req)}
          className="flex-1 text-xs py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border-zinc-700 font-medium"
        >
          Confirm Reject
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
