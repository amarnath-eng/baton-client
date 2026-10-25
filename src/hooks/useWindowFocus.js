import { useEffect, useRef } from 'react'

/**
 * Revalidates data when the browser tab regains focus or visibility.
 * Throttled to prevent spam when rapidly switching windows.
 *
 * @param {() => void} onFocus - Callback to execute when window regains focus
 * @param {number} [throttleMs=10000] - Minimum milliseconds away before re-fetching (default 10s)
 */
export function useWindowFocus(onFocus, throttleMs = 10000) {
  const lastFetchTimeRef = useRef(Date.now())
  const onFocusRef = useRef(onFocus)

  useEffect(() => {
    onFocusRef.current = onFocus
  }, [onFocus])

  useEffect(() => {
    function handleRevalidate() {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        if (now - lastFetchTimeRef.current >= throttleMs) {
          lastFetchTimeRef.current = now
          onFocusRef.current?.()
        }
      }
    }

    document.addEventListener('visibilitychange', handleRevalidate)
    window.addEventListener('focus', handleRevalidate)

    return () => {
      document.removeEventListener('visibilitychange', handleRevalidate)
      window.removeEventListener('focus', handleRevalidate)
    }
  }, [throttleMs])
}
