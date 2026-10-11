import { Button } from '../../components/ui/Button.jsx'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black text-base shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">Baton</span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                v0.1
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wide -mt-0.5">
              Engineering Continuity
            </p>
          </div>
        </div>

        {/* Section Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#problem" className="hover:text-white transition-colors">Problem</a>
          <a href="#readiness" className="hover:text-white transition-colors">Readiness Engine</a>
          <a href="#modules" className="hover:text-white transition-colors">Handover Modules</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#roles" className="hover:text-white transition-colors">Roles</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button variant="primary" className="text-xs px-3.5 py-1.5">
            Register Workspace
          </Button>
        </div>
      </div>
    </header>
  )
}
