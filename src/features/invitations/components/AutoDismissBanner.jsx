import { useState, useEffect } from 'react'

/**
 * Clean auto-dismiss notification banner with countdown timer, hover pause, and dismissal
 */
export default function AutoDismissBanner({ notification, onDismiss, duration = 4 }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)

  // Reset countdown whenever notification changes
  useEffect(() => {
    setTimeLeft(duration)
    setIsPaused(false)
  }, [notification, duration])

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, onDismiss])

  const isApprove = notification?.type === 'approve'

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`rounded-lg border py-1.5 px-3 text-xs flex items-center justify-between gap-3 shadow-sm transition-colors ${
        isApprove
          ? 'border-emerald-500/25 bg-emerald-950/25 text-emerald-200'
          : 'border-rose-500/20 bg-rose-950/20 text-rose-200/90'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isApprove ? 'bg-emerald-400' : 'bg-rose-400/80'
          }`}
        />
        <span className="break-words leading-relaxed">{notification.message}</span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded transition cursor-pointer shrink-0 ${
          isApprove
            ? 'text-emerald-300/80 hover:text-white hover:bg-emerald-500/15'
            : 'text-rose-300/80 hover:text-white hover:bg-rose-500/15'
        }`}
        title={isPaused ? 'Timer paused - click to dismiss' : 'Click to dismiss'}
        aria-label={`Dismiss notification (${timeLeft}s remaining)`}
      >
        <span className="tabular-nums font-mono text-[10px] leading-none opacity-80">
          ({timeLeft}s)
        </span>
        <svg
          className="w-3 h-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
