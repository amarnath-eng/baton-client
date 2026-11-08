import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button.jsx'
import SelectDropdown from '../../components/ui/SelectDropdown.jsx'
import { useTeamManagement } from './hooks/useTeamManagement.js'
import { useDeferredLoading } from '../../hooks/useDeferredLoading.js'
import AccessRequestsTable from './components/AccessRequestsTable.jsx'
import InvitationsTable from './components/InvitationsTable.jsx'
import InviteMemberModal from './InviteMemberModal.jsx'
import AutoDismissBanner from './components/AutoDismissBanner.jsx'

const VALID_REQUEST_FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function TeamManagementPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // 1. Read tab & filter directly from URL Search Parameters (Single Source of Truth)
  const rawTab = searchParams.get('tab')
  const activeTab = rawTab === 'invitations' ? 'invitations' : 'requests'

  const rawFilter = searchParams.get('status')
  const requestFilter = VALID_REQUEST_FILTERS.includes(rawFilter) ? rawFilter : 'all'

  // 2. Setters update the URL with { replace: true } for clean browser history
  const setActiveTab = (tab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', tab)
        if (tab === 'invitations') {
          next.delete('status') // Status sub-filters belong to requests tab
        }
        return next
      },
      { replace: true }
    )
  }

  const setRequestFilter = (status) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', 'requests')
        next.set('status', status)
        return next
      },
      { replace: true }
    )
  }

  const {
    isAdmin,
    canInvite,
    requests,
    invitations,
    loading,
    actionLoadingId,
    error,
    setError,
    notification,
    setNotification,
    approvedInviteData,
    setApprovedInviteData,
    handleReviewRequest,
    handleRevokeInvitation,
    refetch,
  } = useTeamManagement(activeTab)

  // Eliminates skeleton flash when switching tabs or on fast responses
  const showSkeleton = useDeferredLoading(loading, { delayMs: 150, minDurationMs: 300 })

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length
  const allCount = requests.length

  const requestFilterOptions = [
    { label: 'All', value: 'all', count: allCount },
    { label: 'Pending', value: 'pending', count: pendingCount },
    { label: 'Approved', value: 'approved', count: approvedCount },
    { label: 'Rejected', value: 'rejected', count: rejectedCount },
  ]

  const filteredRequests = requestFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === requestFilter)

  const tabOptions = [
    ...(isAdmin
      ? [
          {
            label: 'Requests',
            value: 'requests',
            icon: (
              <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: 'Sent Invitations',
      value: 'invitations',
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0 text-zinc-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 py-1.5 px-3 text-xs text-rose-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="underline hover:text-rose-200 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Retrying...' : 'Retry'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white text-xs ml-2 cursor-pointer p-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {notification && (
        <AutoDismissBanner
          notification={notification}
          onDismiss={() => setNotification(null)}
          duration={4}
        />
      )}

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
            onClick={() => setIsInviteModalOpen(true)}
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
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

      {/* Tab Panels */}
      <div className="animate-fade-in">
        {activeTab === 'requests' && isAdmin ? (
          <AccessRequestsTable
            requests={filteredRequests}
            filterStatus={requestFilter}
            loading={showSkeleton}
            actionLoadingId={actionLoadingId}
            onReview={handleReviewRequest}
            onRevoke={handleRevokeInvitation}
          />
        ) : (
          <InvitationsTable
            invitations={invitations}
            loading={showSkeleton}
            actionLoadingId={actionLoadingId}
            canInvite={canInvite}
            onRevoke={handleRevokeInvitation}
          />
        )}
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvitationCreated={() => refetch()}
      />
    </div>
  )
}
