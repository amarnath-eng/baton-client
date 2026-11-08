import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'

/**
 * Single Responsibility: Presentational success screen displayed when a password
 * has been reset successfully.
 */
export function ForgotPasswordSuccess() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
        ✓
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Password Reset Successfully!
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Your account password has been updated. You can now sign in to your workspace with your new credentials.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition active:scale-95 shadow-sm"
        >
          Sign In to Workspace
        </Link>
      </div>
    </div>
  )
}

