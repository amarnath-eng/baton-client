import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTeamManagement } from './hooks/useTeamManagement.js'
import { useDeferredLoading } from '../../hooks/useDeferredLoading.js'
import AccessRequestsTable from './components/AccessRequestsTable.jsx'
import InvitationsTable from './components/InvitationsTable.jsx'
import InviteMemberModal from './InviteMemberModal.jsx'
import AutoDismissBanner from './components/AutoDismissBanner.jsx'
import TeamSubnavToolbar from './components/TeamSubnavToolbar.jsx'

const VALID_REQUEST_FILTERS = ['all', 'pending', 'approved', 'rejected']

/**
 * Single Responsibility: Orchestrates the Team Management view (fetching data,
 * synchronizing with URL search params, and coordinating sub-panels/modals).
 */
export default function TeamManagementPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [reinviteData, setReinviteData] = useState(null)

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
    handleReviewRequest,
    handleRevokeInvitation,
    refetch,
  } = useTeamManagement(activeTab)

  const handleReinvite = (inv) => {
    setReinviteData({
      name: inv.name,
      email: inv.email,
      employeeId: inv.employeeId,
      role: inv.role,
    })
    setIsInviteModalOpen(true)
  }

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

      {/* Subnav & Action Toolbar */}
      <TeamSubnavToolbar
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabOptions={tabOptions}
        canInvite={canInvite}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        requestFilter={requestFilter}
        setRequestFilter={setRequestFilter}
        requestFilterOptions={requestFilterOptions}
      />

      {/* Tab Panels */}
      <div>
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
            onReinvite={handleReinvite}
          />
        )}
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false)
          setReinviteData(null)
        }}
        initialData={reinviteData}
        onInvitationCreated={() => refetch()}
      />
    </div>
  )
}
