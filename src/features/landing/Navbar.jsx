import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../../components/ui/Button.jsx'
import { logoutUser, AUTH_STATUS } from '../../store/authSlice.js'
import { DesktopUserMenu } from './DesktopUserMenu.jsx'
import { MobileNavDrawer } from './MobileNavDrawer.jsx'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const { user, company, role, isAuthenticated, status } = useSelector((state) => state.auth)

  const isChecking = status === AUTH_STATUS.LOADING || status === AUTH_STATUS.IDLE

  const navLinks = [
    { href: '#problem', label: 'Problem' },
    { href: '#readiness', label: 'Readiness Engine' },
    { href: '#modules', label: 'Handover Modules' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#roles', label: 'Roles' },
  ]

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    closeMenu()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-12 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Clean Standard Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isChecking ? (
            <div className="h-8 w-28 rounded-xl bg-zinc-800/40 animate-pulse border border-zinc-800/50" />
          ) : isAuthenticated ? (
            <DesktopUserMenu
              user={user}
              company={company}
              role={role}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-medium text-zinc-400 hover:text-white px-2.5 py-1.5 transition cursor-pointer rounded-lg hover:bg-zinc-900/60"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  className="text-xs px-3.5 py-1.5 font-medium shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Only */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        isChecking={isChecking}
        isAuthenticated={isAuthenticated}
        user={user}
        company={company}
        role={role}
        onClose={closeMenu}
        onLogout={handleLogout}
      />
    </header>
  )
}

export default Navbar
