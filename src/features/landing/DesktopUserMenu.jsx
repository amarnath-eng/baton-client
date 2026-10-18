import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button.jsx'

export function DesktopUserMenu({ user, company, role, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  // Click-outside and Escape key listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  return (
    <div className="flex items-center gap-2.5">
      {/* Primary Workspace CTA */}
      <Link to="/dashboard">
        <Button
          variant="primary"
          size="sm"
          className="group text-xs px-3.5 py-1.5 font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          <span>Open Baton</span>
          <svg
            className="w-3.5 h-3.5 text-black/70 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </Link>

      {/* Profile Avatar with Floating Card */}
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className="group flex items-center gap-1.5 p-0.5 rounded-xl transition cursor-pointer"
          aria-label="User profile menu"
          aria-expanded={userMenuOpen}
          aria-haspopup="true"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-semibold transition shadow-sm ${
              userMenuOpen
                ? 'border-white/30 bg-zinc-800 text-white ring-2 ring-white/10'
                : 'border border-zinc-700/80 bg-zinc-800 text-zinc-200 group-hover:border-zinc-500 group-hover:text-white'
            }`}
          >
            {initials}
          </div>
          <svg
            className={`w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${
              userMenuOpen ? 'rotate-180 text-white' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 min-w-[220px] rounded-xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl z-50 p-1 text-left animate-in fade-in zoom-in-95 duration-100">
            {/* Identity & Context */}
            <div className="px-3 py-2.5">
              <p className="text-xs font-semibold text-white whitespace-nowrap leading-snug">
                {user?.fullName}
              </p>
              <p className="text-xs text-zinc-400 font-mono whitespace-nowrap leading-normal mt-0.5">
                {user?.email}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wide text-zinc-300 whitespace-nowrap lowercase">
                  {company?.slug || company?.name?.toLowerCase() || 'workspace'}
                </span>
                <span className="text-zinc-700 text-xs select-none">|</span>
                <span className="text-[11px] font-mono tracking-wide text-emerald-400 font-medium capitalize">
                  {role || 'member'}
                </span>
              </div>
            </div>

            {/* Flat 1px Divider */}
            <div className="h-px bg-zinc-800/80 my-1" />

            {/* Sign Out Action */}
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false)
                onLogout()
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
