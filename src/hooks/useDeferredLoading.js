import { useState, useEffect, useRef } from 'react'

/**
 * Eliminates "Skeleton Flash" / loading flicker.
 *
 * Pattern:
 * 1. If API completes in < delayMs (e.g. 150ms), skeleton is NEVER shown (0 flicker).
 * 2. If API takes > delayMs, skeleton appears smoothly and stays visible for at least
 *    minDurationMs (e.g. 300ms) so the eye doesn't experience a jarring 10ms frame glitch.
 *
 * @param {boolean} isLoading - Raw loading flag from state or query
 * @param {object} options
 * @param {number} [options.delayMs=150] - Threshold before showing skeleton
 * @param {number} [options.minDurationMs=300] - Minimum hold duration if shown
 * @returns {boolean} Whether to render the skeleton UI
 */
export function useDeferredLoading(isLoading, { delayMs = 150, minDurationMs = 300 } = {}) {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const shownAtRef = useRef(0)
  const delayTimerRef = useRef(null)
  const minHoldTimerRef = useRef(null)

  useEffect(() => {
    if (isLoading) {
      // Clear any pending hold-timer from a previous cycle
      if (minHoldTimerRef.current) {
        clearTimeout(minHoldTimerRef.current)
        minHoldTimerRef.current = null
      }

      // Schedule skeleton display only if request exceeds delayMs
      delayTimerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now()
        setShowSkeleton(true)
      }, delayMs)
    } else {
      // API finished. Clear the scheduled delay timer
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current)
        delayTimerRef.current = null
      }

      // If skeleton was already rendered, enforce minimum display duration
      if (shownAtRef.current > 0) {
        const elapsed = Date.now() - shownAtRef.current
        const remaining = minDurationMs - elapsed

        if (remaining > 0) {
          minHoldTimerRef.current = setTimeout(() => {
            setShowSkeleton(false)
            shownAtRef.current = 0
          }, remaining)
        } else {
          setShowSkeleton(false)
          shownAtRef.current = 0
        }
      } else {
        // Was never shown (fast response < delayMs)
        setShowSkeleton(false)
      }
    }

    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      if (minHoldTimerRef.current) clearTimeout(minHoldTimerRef.current)
    }
  }, [isLoading, delayMs, minDurationMs])

  return showSkeleton
}

export default useDeferredLoading
