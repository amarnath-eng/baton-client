import React, { useEffect, useState } from 'react'

/**
 * Butter-Smooth Adaptive Modal Component for Baton (Linear/Raycast Hybrid):
 * - GPU-accelerated CSS transitions on open AND close (cubic-bezier momentum curve).
 * - Mobile (< 768px): Full-page overlay sheet with pinned top-right close icon.
 * - Laptop / Desktop (>= 768px): Elevated centered dark-glass card (max-w-lg/xl, max-h-[85vh]),
 *   preserving dashboard context (backdrop-blur-md) with close icon anchored beside the title.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  const [isMounted, setIsMounted] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  // 1. Responsive Viewport Listener
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 2. Butter-Smooth Mount & Unmount Transition Lifecycle
  useEffect(() => {
    let timer

    if (isOpen) {
      setIsMounted(true)
      // Allow browser to register initial mount frame before transitioning
      timer = setTimeout(() => {
        setIsVisible(true)
      }, 25)
    } else {
      setIsVisible(false)
      // Wait for exit transition (250ms) before unmounting from DOM
      timer = setTimeout(() => {
        setIsMounted(false)
      }, 260)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isOpen])

  // 3. Lock background scroll & listen for Escape key
  useEffect(() => {
    if (!isMounted) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMounted, onClose])

  if (!isMounted) return null

  // =========================================================================
  // CASE A: MOBILE (< 768px — Dedicated Full-Page Overlay Sheet)
  // =========================================================================
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 bg-[#0c0c0e] text-white overflow-y-auto flex flex-col select-none transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Pinned Top-Right Close Button on Screen Corner */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          className="fixed top-4 right-4 z-50 h-9 w-9 rounded-full border border-zinc-800 bg-zinc-900/95 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-xl backdrop-blur-md active:scale-95"
          aria-label="Close page"
          title="Close (Esc)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mobile Full-Page Body */}
        <div className="w-full px-4 pt-4 pb-12 flex-1 flex flex-col select-text">
          {(title || subtitle) && (
            <div className="pb-3 mb-4 border-b border-zinc-800/80 pr-12">
              {title && (
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className={`flex-1 flex flex-col ${className}`}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // CASE B: LAPTOP & MONITOR (>= 768px — Elevated Centered Dark-Glass Card)
  // =========================================================================
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'bg-black/75 backdrop-blur-md opacity-100'
          : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        className={`w-full ${maxWidth} max-h-[85vh] rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] shadow-2xl relative text-left flex flex-col overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.95] translate-y-3 pointer-events-none'
        }`}
      >
        {/* Pinned Card Header with Close Button beside title */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800/80 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800 cursor-pointer shrink-0"
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Card Body */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-5 sm:px-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
