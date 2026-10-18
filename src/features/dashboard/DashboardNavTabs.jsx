export default function DashboardNavTabs({
  activeTab = 'handovers',
  onTabChange,
  pendingRequestsCount = 0,
  isPrivileged = false,
  variant = 'desktop',
}) {
  if (variant === 'desktop') {
    return (
      <div className="hidden md:flex items-center justify-center">
        <nav className="flex items-center p-1 rounded-xl border border-white/[0.08] bg-zinc-900/70 backdrop-blur-md shadow-inner">
          <button
            type="button"
            onClick={() => onTabChange?.('handovers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'handovers'
                ? 'bg-zinc-800 text-white shadow-[0_1px_3px_rgba(0,0,0,0.6)] border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Handovers</span>
          </button>

          {isPrivileged && (
            <button
              type="button"
              onClick={() => onTabChange?.('team')}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'team'
                  ? 'bg-zinc-800 text-white shadow-[0_1px_3px_rgba(0,0,0,0.6)] border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Team & Access</span>
              {pendingRequestsCount > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onTabChange?.('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-zinc-800 text-white shadow-[0_1px_3px_rgba(0,0,0,0.6)] border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Audit Log</span>
          </button>
        </nav>
      </div>
    )
  }

  // Mobile Underline Sub-Navigation
  return (
    <div className="md:hidden border-t border-white/[0.06] px-4 flex items-center justify-around text-xs font-medium bg-[#09090b]">
      <button
        type="button"
        onClick={() => onTabChange?.('handovers')}
        className={`py-2.5 transition whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
          activeTab === 'handovers'
            ? 'text-white border-white font-semibold'
            : 'text-zinc-500 border-transparent hover:text-zinc-300'
        }`}
      >
        Handovers
      </button>

      {isPrivileged && (
        <button
          type="button"
          onClick={() => onTabChange?.('team')}
          className={`py-2.5 transition whitespace-nowrap cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === 'team'
              ? 'text-white border-white font-semibold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <span>Team & Access</span>
          {pendingRequestsCount > 0 && (
            <span className="flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={() => onTabChange?.('audit')}
        className={`py-2.5 transition whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
          activeTab === 'audit'
            ? 'text-white border-white font-semibold'
            : 'text-zinc-500 border-transparent hover:text-zinc-300'
        }`}
      >
        Audit Log
      </button>
    </div>
  )
}
