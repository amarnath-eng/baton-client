import { Button } from '../../../components/ui/Button.jsx'
import SelectDropdown from '../../../components/ui/SelectDropdown.jsx'

/**
 * Single Responsibility: Renders the team subnav tabs, mobile dropdown selector,
 * status sub-filters with counter badges, and the primary "Invite Member" action button.
 */
export default function TeamSubnavToolbar({
  isAdmin,
  activeTab,
  setActiveTab,
  tabOptions,
  canInvite,
  onOpenInviteModal,
  requestFilter,
  setRequestFilter,
  requestFilterOptions,
}) {
  return (
    <>
      {/* Sleek Action & Subnav Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 sm:pb-4">
        {/* Mobile: Ultra-Modern Dropdown Selector */}
        <div className="sm:hidden">
          <SelectDropdown
            value={activeTab}
            onChange={setActiveTab}
            options={tabOptions}
          />
        </div>

        {/* Desktop: Subnav Pills (Matching Handovers layout) */}
        <div className="hidden sm:flex items-center gap-1.5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'requests'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Requests</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('invitations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'invitations' || !isAdmin
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Sent Invitations</span>
          </button>
        </div>

        {/* Primary Action Button */}
        {canInvite && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenInviteModal}
            className="shrink-0 text-xs py-1.5 px-3.5 shadow-sm shadow-white/10 flex items-center gap-1.5"
          >
            <span className="text-sm font-semibold leading-none">+</span>
            <span className="sm:hidden">Invite</span>
            <span className="hidden sm:inline">Invite Member</span>
          </Button>
        )}
      </div>

      {/* Requests Status Sub-filters (All, Pending, Approved, Rejected) */}
      {activeTab === 'requests' && isAdmin && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {requestFilterOptions.map((f) => {
            const isActive = requestFilter === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setRequestFilter(f.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5 shrink-0 outline-none focus:outline-none select-none ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 pt-0.5 text-[10px] font-mono font-medium leading-none rounded-full ${
                    isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

