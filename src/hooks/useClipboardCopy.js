import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Custom hook to safely copy text to the system clipboard with an active ID indicator
 * @param {number} resetDelayMs - Duration in milliseconds before resetting copied state (default 2000ms)
 * @returns {{ copiedId: string|number|null, copyToClipboard: (text: string, id?: string|number) => Promise<boolean> }}
 */
export function useClipboardCopy(resetDelayMs = 2000) {
  const [copiedId, setCopiedId] = useState(null)
  const timeoutRef = useRef(null)

  const copyToClipboard = useCallback(
    async (arg1, arg2) => {
      // Intelligently handle both (text, id) and (id, text)
      let text = ''
      let id = null

      if (typeof arg1 === 'string' && (arg1.startsWith('http://') || arg1.startsWith('https://') || arg1.includes('/'))) {
        text = arg1
        id = arg2 ?? arg1
      } else if (typeof arg2 === 'string' && (arg2.startsWith('http://') || arg2.startsWith('https://') || arg2.includes('/'))) {
        text = arg2
        id = arg1
      } else {
        text = arg1
        id = arg2 ?? arg1
      }

      if (!text) return false

      // Always print invitation link in browser console as required
      console.log('[Baton Invitation Link]:', text)

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          // Fallback for non-HTTPS or restricted iframe contexts
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.left = '-999999px'
          textarea.style.top = '-999999px'
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }

        setCopiedId(id)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          setCopiedId(null)
        }, resetDelayMs)
        return true
      } catch (err) {
        // Final fallback attempt if navigator.clipboard rejected with NotAllowedError
        try {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.left = '-999999px'
          textarea.style.top = '-999999px'
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)

          setCopiedId(id)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setCopiedId(null)
          }, resetDelayMs)
          return true
        } catch (fallbackErr) {
          console.error('Failed to copy text to clipboard:', err, fallbackErr)
          return false
        }
      }
    },
    [resetDelayMs]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copiedId, copyToClipboard }
}
