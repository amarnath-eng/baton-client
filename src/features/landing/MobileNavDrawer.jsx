import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button.jsx'
import { ROUTES } from '../../routes/paths.js'

export function MobileNavDrawer({
  isOpen,
  navLinks,
  isChecking,
  isAuthenticated,
  user,
  company,
  role,
  onClose,
  onLogout,
}) {
  if (!isOpen) return null

  return (
    <div className="md:hidden border-b border-zinc-800 bg-[#09090b]/98 backdrop-blur-2xl px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile Auth & Account Session */}
      <div className="pt-3 border-t border-zinc-800/80">
        {isChecking ? (
          <div className="h-10 w-full rounded-xl bg-zinc-800/40 animate-pulse border border-zinc-800/50" />
        ) : isAuthenticated ? (
          <div className="space-y-3">
            {/* Identity Card */}
            <div className="px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <p className="text-xs font-semibold text-white truncate leading-snug">
                {user?.fullName}
              </p>
              <p className="text-xs text-zinc-400 font-mono truncate leading-normal mt-0.5">
                {user?.email}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wide text-zinc-300 truncate lowercase">
                  {company?.slug || company?.name?.toLowerCase() || 'workspace'}
                </span>
                <span className="text-zinc-700 text-xs select-none">|</span>
                <span className="text-[11px] font-mono tracking-wide text-emerald-400 font-medium capitalize">
                  {role || 'member'}
                </span>
              </div>
            </div>

            {/* Full-width Open Baton Button */}
            <Link to={ROUTES.DASHBOARD} className="block w-full">
              <Button
                variant="primary"
                className="w-full justify-center text-xs py-2.5 font-medium shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <span>Open Baton</span>
              </Button>
            </Link>

            {/* Full-width Sign Out Button */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/10 transition cursor-pointer"
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
        ) : (
          <div className="space-y-2">
            <Link to={ROUTES.LOGIN} className="block">
              <Button variant="secondary" className="w-full justify-center text-xs py-2 font-medium">
                Sign In
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER} className="block">
              <Button variant="primary" className="w-full justify-center text-xs py-2 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
