import { Link } from 'react-router-dom'
import { buildRoute } from '../../../routes/paths.js'

export function WorkspaceCollisionCard({
  slug,
  companyName,
  onRequestAccess,
}) {
  return (
    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3 transition-all duration-200 text-left">
      <div className="flex items-start gap-2.5">
        <span className="text-amber-400 text-sm leading-none mt-0.5">⚠️</span>
        <div className="text-xs text-zinc-300 leading-relaxed">
          <span className="font-semibold text-white">
            "{companyName || slug}"
          </span>{' '}
          is already registered.
        </div>
      </div>

      <div className="text-xs text-zinc-400">
        Want to join this workspace?
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          to={buildRoute.loginWithWorkspace(slug)}
          className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition"
        >
          Sign In
        </Link>
        <button
          type="button"
          onClick={onRequestAccess}
          className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-black transition cursor-pointer"
        >
          Request Access
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 leading-normal">
        Or pick a different workspace URL above to create a new team.
      </p>
    </div>
  )
}
