import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../components/ui/Button.jsx'
import { logoutUser } from '../store/authSlice.js'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { user, company, role } = useSelector((state) => state.auth)

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Top Application Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black text-base shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">{company?.name || 'Workspace'}</span>
              <span className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                {role || 'member'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Engineering Continuity Workspace</p>
          </div>
        </div>

        {/* User Profile Pill & Sign Out */}
        <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 text-xs font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="text-left hidden sm:block pr-2">
            <p className="text-xs font-medium text-white leading-tight">{user?.fullName}</p>
            <p className="text-[10px] text-zinc-400 font-mono leading-tight">{user?.email}</p>
          </div>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <button
            type="button"
            onClick={() => dispatch(logoutUser())}
            title="Sign out of workspace"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
            aria-label="Sign out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.fullName}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Workspace: <span className="text-white font-medium">{company?.name}</span> ({company?.slug})
          </p>
        </div>

        {/* Overview Banner */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Active Handovers</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Role-verified knowledge transfer with automated readiness checks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="primary">
              + New Handover
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
