import { useState } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import SelectDropdown from '../../components/ui/SelectDropdown.jsx'
import { useTeamManagement } from './hooks/useTeamManagement.js'
import { useDeferredLoading } from '../../hooks/useDeferredLoading.js'
import AccessRequestsTable from './components/AccessRequestsTable.jsx'
import InvitationsTable from './components/InvitationsTable.jsx'
import ApprovedInviteModal from './components/ApprovedInviteModal.jsx'
import InviteMemberModal from './InviteMemberModal.jsx'
import AutoDismissBanner from './components/AutoDismissBanner.jsx'

export default function TeamManagementPanel() {
  const [activeTab, setActiveTab] = useState('requests')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

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

  const tabOptions = [
    ...(isAdmin
      ? [
          {
            label: 'Pending Requests',
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

      {/* Generated Invite Link Modal */}
      <ApprovedInviteModal
        isOpen={Boolean(approvedInviteData)}
        inviteData={approvedInviteData}
        onClose={() => setApprovedInviteData(null)}
      />

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
              <span>Pending Requests</span>
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

      {/* Tab Panels */}
      <div className="animate-fade-in">
        {activeTab === 'requests' && isAdmin ? (
          <AccessRequestsTable
            requests={requests}
            loading={showSkeleton}
            actionLoadingId={actionLoadingId}
            onReview={handleReviewRequest}
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
