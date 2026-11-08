import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'

/**
 * Single Responsibility: Presentational error card for invalid or expired invitation tokens.
 */
export function AcceptInviteError({ error }) {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-rose-500/20 bg-zinc-950/90 text-center space-y-5">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 text-xl font-bold">
        !
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Invitation Link Invalid or Expired
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {error || 'This invitation link is no longer valid or has already expired.'}
        </p>
      </div>
      <div className="pt-2 space-y-2.5">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
        >
          Sign In to Existing Account
        </Link>
        <Link
          to={ROUTES.REGISTER}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition"
        >
          Register a New Workspace
        </Link>
        <p className="text-[11px] text-zinc-500 text-center pt-1">
          Need a fresh invite? Ask your workspace lead to dispatch a new link.
        </p>
      </div>
    </div>
  )
}

