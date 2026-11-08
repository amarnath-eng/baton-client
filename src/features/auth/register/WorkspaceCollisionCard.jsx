import { Link } from 'react-router-dom'
import { buildRoute } from '../../../routes/paths.js'

export function WorkspaceCollisionCard({
  slug,
  companyName,
  onRequestAccess,
}) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-3.5 transition-all duration-200 text-left shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 text-base font-semibold">
          🏢
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white tracking-tight">
            {companyName || slug}
          </div>
          <div className="text-xs text-amber-300/90 font-mono mt-0.5">
            app.baton.dev/{slug}
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            This company workspace is already active on Baton. Choose how you would like to proceed:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Link
          to={buildRoute.loginWithWorkspace(slug)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition cursor-pointer text-center"
        >
          <span>Sign In to Workspace</span>
          <span className="text-zinc-400">→</span>
        </Link>
        <button
          type="button"
          onClick={onRequestAccess}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-black transition cursor-pointer text-center shadow-sm"
        >
          <span>Request Access</span>
          <span className="text-black/70">→</span>
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 text-center pt-2 border-t border-zinc-800/80">
        Want to create a different workspace? Try a different company name or slug above.
      </p>
    </div>
  )
}
