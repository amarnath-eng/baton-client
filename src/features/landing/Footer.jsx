import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes/paths.js'
import { Button } from '../../components/ui/Button.jsx'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        
        {/* Minimal High-Impact CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-5 pb-4 sm:pb-5 border-b border-zinc-900/80">
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Ready to verify your next handover?
            </h3>
            <p className="hidden sm:block text-xs text-zinc-400 mt-0.5">
              Structured documentation, two-way verification, and zero orphan tasks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link to={ROUTES.LOGIN}>
              <Button 
                variant="outline" 
                className="text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
              >
                Sign In
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button 
                variant="primary" 
                className="group text-xs px-4 py-1.5 sm:px-5 sm:py-2 font-medium bg-white text-black hover:bg-zinc-200 inline-flex items-center gap-1.5"
              >
                <span>Verify Your Handover</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>

        {/* Clean Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white font-extrabold text-black text-xs shadow-sm">
                B
              </div>
              <span className="font-bold text-white tracking-tight">
                Baton
              </span>
            </Link>
            <span className="text-zinc-700">&bull;</span>
            <span className="text-zinc-500">
              &copy; {new Date().getFullYear()} Baton Continuity Inc.
            </span>
          </div>

          {/* Core Links (Desktop / Tablet only) */}
          <div className="hidden sm:flex items-center gap-5 text-zinc-400">
            <a href="#why-baton" className="hover:text-white transition-colors">
              Why Baton
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
