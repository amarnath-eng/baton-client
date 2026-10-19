import { useState } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import { useTeamManagement } from './hooks/useTeamManagement.js'
import AccessRequestsTable from './components/AccessRequestsTable.jsx'
import InvitationsTable from './components/InvitationsTable.jsx'
import ApprovedInviteBanner from './components/ApprovedInviteBanner.jsx'
import InviteMemberModal from './InviteMemberModal.jsx'

export default function TeamManagementPanel({ onPendingRequestsChange }) {
  const [activeTab, setActiveTab] = useState('requests')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const {
    isAdmin,
    canInvite,
    requests,
    invitations,
    pendingRequestsCount,
    loading,
    actionLoadingId,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    approvedInviteUrl,
    setApprovedInviteUrl,
    handleReviewRequest,
    handleRevokeInvitation,
    refetch,
  } = useTeamManagement(onPendingRequestsChange)

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Team & Access Management
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage incoming workspace access requests and team member invitations.
          </p>
        </div>

        {canInvite && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsInviteModalOpen(true)}
          >
            + Invite Team Member
          </Button>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-400 flex items-center justify-between">
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
            className="text-rose-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Generated Invite Link Banner */}
      <ApprovedInviteBanner
        inviteUrl={approvedInviteUrl}
        onClose={() => setApprovedInviteUrl(null)}
      />

      {/* Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>Pending Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('invitations')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'invitations' || !isAdmin
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <span>Sent Invitations</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300">
            {invitations.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'requests' && isAdmin ? (
        <AccessRequestsTable
          requests={requests}
          loading={loading}
          actionLoadingId={actionLoadingId}
          onReview={handleReviewRequest}
        />
      ) : (
        <InvitationsTable
          invitations={invitations}
          loading={loading}
          actionLoadingId={actionLoadingId}
          canInvite={canInvite}
          onRevoke={handleRevokeInvitation}
        />
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvitationCreated={() => refetch()}
      />
    </div>
  )
}
