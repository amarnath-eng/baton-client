import { useState, useRef, useEffect } from 'react'
import { Button } from '../../../components/ui/Button.jsx'

/**
 * Isolated rejection form with 2-row default note, side-by-side actions,
 * and two-step confirmation (Reject -> Confirm Reject? -> Cancel).
 */
export default function RejectActionBox({
  requestId,
  req,
  actionLoadingId,
  onReview,
  onCancel,
  layout = 'desktop',
}) {
  const [reason, setReason] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const textareaRef = useRef(null)

  const handleInput = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 52), 160)}px`
    setReason(el.value)
  }

  const handleRejectClick = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }
    onReview(requestId, 'reject', null, reason, req)
    onCancel?.()
  }

  const handleCancel = () => {
    if (isConfirming) {
      setIsConfirming(false)
    } else {
      onCancel?.()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  if (layout === 'desktop') {
    return (
      <div className="flex items-center gap-3 w-full animate-in fade-in duration-100">
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={handleInput}
          placeholder="Rejection note (optional)..."
          rows={2}
          className="flex-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 focus:outline-none min-h-[52px] leading-relaxed resize-none overflow-y-auto scrollbar-thin tracking-wide"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant={isConfirming ? 'danger' : 'outline'}
            loading={actionLoadingId === requestId}
            onClick={handleRejectClick}
            className={`text-xs px-4 py-2 font-medium transition active:scale-95 whitespace-nowrap rounded-xl cursor-pointer ${
              isConfirming
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 font-semibold shadow-sm'
                : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white border-rose-500/30'
            }`}
          >
            {isConfirming ? 'Confirm Reject?' : 'Reject'}
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3.5 py-2 text-xs text-zinc-400 hover:text-white rounded-xl border border-zinc-800 hover:bg-zinc-850 transition cursor-pointer whitespace-nowrap text-center"
          >
            Cancel
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
        placeholder="Rejection note (optional)..."
        rows={2}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60 focus:outline-none min-h-[52px] leading-relaxed resize-none overflow-y-auto scrollbar-thin tracking-wide"
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant={isConfirming ? 'danger' : 'outline'}
          loading={actionLoadingId === requestId}
          onClick={handleRejectClick}
          className={`text-xs px-3.5 py-1.5 font-medium transition active:scale-95 rounded-lg cursor-pointer ${
            isConfirming
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 font-semibold shadow-sm'
              : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white border-rose-500/30'
          }`}
        >
          {isConfirming ? 'Confirm Reject?' : 'Reject'}
        </Button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
