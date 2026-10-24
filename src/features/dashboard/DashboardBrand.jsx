import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '../../routes/paths.js'

export default function DashboardBrand({ isOverflowing, onOverflowChange }) {
  const { company, role } = useSelector((state) => state.auth)
  const measureRef = useRef(null)
  const firstColRef = useRef(null)

  useEffect(() => {
    function checkOverflow() {
      if (!measureRef.current) return

      const brandWidth = measureRef.current.offsetWidth
      const isLaptop = window.innerWidth >= 768

      let overflowing = false
      if (isLaptop) {
        const colWidth = firstColRef.current?.clientWidth || (window.innerWidth / 3)
        overflowing = brandWidth > colWidth * 0.75
      } else {
        overflowing = brandWidth > window.innerWidth * 0.75
      }
      onOverflowChange?.(overflowing)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [company?.name, role, onOverflowChange])

  return (
    <>
      {/* Invisible probe to accurately calculate rendered brand width without flicker */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="fixed -left-[9999px] top-0 invisible pointer-events-none flex items-center gap-2.5 sm:gap-3"
      >
        <div className="h-7 w-7 rounded-lg shrink-0">B</div>
        <div className="h-4 w-px shrink-0" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
            {company?.name || 'Workspace'}
          </span>
          <span className="rounded-md px-2 py-0.5 text-[10px] font-mono capitalize shrink-0">
            {role || 'member'}
          </span>
        </div>
      </div>

      {/* Column 1 Brand Container */}
      <div ref={firstColRef} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {isOverflowing ? (
          /* Fallback to workspace branding when text overflows > 75% */
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 sm:gap-3 group shrink-0" title="Back to Dashboard">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white font-extrabold text-black text-xs sm:text-sm shadow-sm shrink-0">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-none group-hover:text-zinc-300 transition-colors">
                  Baton
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 translate-y-[0.5px]">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 tracking-wide mt-1 hidden sm:block leading-none">
                Engineering Continuity
              </p>
            </div>
          </Link>
        ) : (
          /* Workspace Breadcrumb when within 75% */
          <>
            <Link to={ROUTES.DASHBOARD} className="group shrink-0" title="Back to Dashboard">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white font-extrabold text-black text-xs sm:text-sm shadow-sm group-hover:bg-zinc-200 transition-colors shrink-0">
                B
              </div>
            </Link>

            <div className="h-4 w-px bg-zinc-800 shrink-0 select-none" />

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight whitespace-nowrap">
                {company?.name || 'Workspace'}
              </span>
              <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400 capitalize shrink-0">
                {role || 'member'}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  )
}
