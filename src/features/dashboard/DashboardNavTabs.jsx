import { DASHBOARD_ROUTES } from '../../routes/paths'

const NAV_TABS = [
  {
    id: DASHBOARD_ROUTES.HANDOVERS,
    label: 'Handovers',
    icon: (
      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    privilegedOnly: false,
  },
  {
    id: DASHBOARD_ROUTES.TEAM,
    label: 'Team & Access',
    icon: (
      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    privilegedOnly: true,
  },
  {
    id: DASHBOARD_ROUTES.AUDIT,
    label: 'Audit Log',
    icon: (
      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    privilegedOnly: false,
  },
]

export default function DashboardNavTabs({
  activeTab = DASHBOARD_ROUTES.HANDOVERS,
  onTabChange,
  isPrivileged = false,
  variant = 'desktop',
}) {
  const visibleTabs = NAV_TABS.filter((tab) => !tab.privilegedOnly || isPrivileged)

  if (variant === 'desktop') {
    return (
      <div className="hidden md:flex items-center justify-center">
        <nav className="flex items-center p-1 rounded-xl border border-white/[0.08] bg-zinc-900/70 backdrop-blur-md shadow-inner">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-[0_1px_3px_rgba(0,0,0,0.6)] border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // Mobile Underline Sub-Navigation
  return (
    <div className="md:hidden border-t border-white/[0.06] px-4 flex items-center justify-around text-xs font-medium bg-[#09090b]">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange?.(tab.id)}
          className={`py-2 transition whitespace-nowrap cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === tab.id
              ? 'text-white border-white font-semibold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

