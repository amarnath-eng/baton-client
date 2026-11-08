import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHandoverDetail } from './hooks/useHandoverDetail.js'
import HandoverHeroCard from './components/HandoverHeroCard.jsx'
import HandoverSectionTabs from './components/HandoverSectionTabs.jsx'
import HandoverSectionEditor from './components/HandoverSectionEditor.jsx'
import HandoverSignoffBar from './components/HandoverSignoffBar.jsx'
import HandoverReviewModal from './components/HandoverReviewModal.jsx'
import { ROUTES } from '../../routes/paths.js'
import { Button } from '../../components/ui/Button.jsx'

/**
 * Single Responsibility: Workspace view orchestrator for an individual Handover.
 * Coordinates section switching, review modals, sign-off actions, and section saving.
 */
export default function HandoverDetailWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    handover,
    loading,
    error,
    setError,
    activeSectionKey,
    setActiveSectionKey,
    draftContent,
    setDraftContent,
    isSectionComplete,
    setIsSectionComplete,
    isSaving,
    saveSuccessMessage,
    actionLoading,
    canEditSection,
    canSubmitForReview,
    canReview,
    canAcknowledge,
    completedSectionsCount,
    allSectionsComplete,
    saveSection,
    submitForReview,
    submitReview,
    acknowledgeHandover,
  } = useHandoverDetail(id)

  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    action: 'approve', // 'approve' | 'request_revision'
  })

  const handleOpenReviewModal = (action) => {
    setReviewModalState({ isOpen: true, action })
  }

  const handleCloseReviewModal = () => {
    setReviewModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleConfirmReview = async (reviewNotes) => {
    await submitReview(reviewModalState.action, reviewNotes)
    handleCloseReviewModal()
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-zinc-800 rounded" />
        <div className="h-28 bg-zinc-900 rounded-2xl" />
        <div className="h-96 bg-zinc-900 rounded-2xl" />
      </div>
    )
  }

  if (error && !handover) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-300">{error}</p>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.DASHBOARD_HANDOVERS)}
          className="text-xs"
        >
          ← Back to Handovers
        </Button>
      </div>
    )
  }

  if (!handover) return null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD_HANDOVERS)}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition cursor-pointer font-medium"
        >
          <span>←</span> Back to all handovers
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          ID: {handover._id?.slice(-8)}
        </span>
      </div>

      {/* Handover Hero Summary Card */}
      <HandoverHeroCard
        handover={handover}
        completedSectionsCount={completedSectionsCount}
      />

      {/* Lifecycle Signoff / Stage Action Bar */}
      <HandoverSignoffBar
        handover={handover}
        canSubmitForReview={canSubmitForReview}
        canReview={canReview}
        canAcknowledge={canAcknowledge}
        allSectionsComplete={allSectionsComplete}
        completedSectionsCount={completedSectionsCount}
        actionLoading={actionLoading}
        onSubmitForReview={submitForReview}
        onOpenReviewModal={handleOpenReviewModal}
        onAcknowledge={acknowledgeHandover}
      />

      {/* Error alert if any lifecycle action fails */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6 Technical Continuity Section Tabs & Active Editor */}
      <div className="space-y-4">
        <HandoverSectionTabs
          activeSectionKey={activeSectionKey}
          setActiveSectionKey={setActiveSectionKey}
          sections={handover.sections}
        />

        <HandoverSectionEditor
          sectionKey={activeSectionKey}
          content={draftContent}
          isComplete={isSectionComplete}
          canEdit={canEditSection}
          isSaving={isSaving}
          saveSuccessMessage={saveSuccessMessage}
          onContentChange={setDraftContent}
          onCompleteToggle={(checked) => {
            setIsSectionComplete(checked)
            saveSection(draftContent, checked)
          }}
          onSave={() => saveSection(draftContent, isSectionComplete)}
        />
      </div>

      {/* Manager Review Notes Modal */}
      <HandoverReviewModal
        isOpen={reviewModalState.isOpen}
        action={reviewModalState.action}
        loading={actionLoading}
        onClose={handleCloseReviewModal}
        onSubmit={handleConfirmReview}
      />
    </div>
  )
}
