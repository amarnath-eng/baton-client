import { useState } from 'react'
import { Button } from '../../components/ui/Button.jsx'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '#problem', label: 'Problem' },
    { href: '#readiness', label: 'Readiness Engine' },
    { href: '#modules', label: 'Handover Modules' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#roles', label: 'Roles' },
  ]

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black text-base shadow-sm shrink-0">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">Baton</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                v0.1
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wide -mt-0.5 hidden sm:block">
              Engineering Continuity
            </p>
          </div>
        </div>

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
          <button
            type="button"
            className="text-xs font-medium text-zinc-400 hover:text-white px-2.5 py-1.5 transition cursor-pointer rounded-lg hover:bg-zinc-900/60"
          >
            Log In
          </button>
          <Button variant="primary" className="text-xs px-3.5 py-1.5 font-medium">
            Get Started
          </Button>
        </div>

        {/* Mobile Actions: Direct Log In button + Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            className="text-xs font-medium text-zinc-200 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 hover:bg-zinc-800 transition cursor-pointer"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation menu"
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition cursor-pointer"
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

      {/* Mobile Drawer (Clean navigation jump links only) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0c0c0e] px-4 py-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
