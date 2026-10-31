import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useHandoverDetail } from './hooks/useHandoverDetail.js'
import HandoverStatusBadge from './components/HandoverStatusBadge.jsx'
import HandoverSectionEditor from './components/HandoverSectionEditor.jsx'
import HandoverSignoffBar from './components/HandoverSignoffBar.jsx'
import HandoverReviewModal from './components/HandoverReviewModal.jsx'
import { HANDOVER_SECTIONS } from '../../constants/handover.js'
import { ROUTES } from '../../routes/paths.js'
import { Button } from '../../components/ui/Button.jsx'
import SelectDropdown from '../../components/ui/SelectDropdown.jsx'

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
    // Permissions & Counts
    canEditSection,
    canSubmitForReview,
    canReview,
    canAcknowledge,
    completedSectionsCount,
    allSectionsComplete,
    // Lifecycle Methods
    saveSection,
    submitForReview,
    submitReview,
    acknowledgeHandover,
  } = useHandoverDetail(id)

  // Manager review modal state
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

  const deadlineStr = handover.deadline
    ? new Date(handover.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No deadline'

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
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {handover.project}
              </span>
              <HandoverStatusBadge status={handover.status} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {handover.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {handover.reason}
            </p>
          </div>

          <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-900">
            <span className="text-[11px] text-zinc-500">Target Deadline</span>
            <span className="text-sm font-semibold text-zinc-200">{deadlineStr}</span>
          </div>
        </div>

        {/* Transfer Participants & Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900 text-xs">
          {/* Outgoing */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[11px] text-zinc-300">
              {handover.outgoingEngineerId?.fullName?.charAt(0) || 'O'}
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">
                Outgoing Engineer
              </span>
              <span className="text-zinc-200 font-medium">
                {handover.outgoingEngineerId?.fullName || 'Unassigned'}
              </span>
            </div>
          </div>

          {/* Incoming */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[11px] text-zinc-300">
              {handover.incomingEngineerId?.fullName?.charAt(0) || 'I'}
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">
                Incoming Engineer
              </span>
              <span className="text-zinc-200 font-medium">
                {handover.incomingEngineerId?.fullName || 'Unassigned'}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-medium">Continuity Progress</span>
              <span className="font-mono text-zinc-300">
                {completedSectionsCount} of {HANDOVER_SECTIONS.length} Complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${(completedSectionsCount / HANDOVER_SECTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* 6 Technical Continuity Section Tabs */}
      <div className="space-y-4">
        {/* Mobile: SelectDropdown for fast, tactile section jumping */}
        <div className="sm:hidden">
          <SelectDropdown
            value={activeSectionKey}
            onChange={setActiveSectionKey}
            options={HANDOVER_SECTIONS.map((sec, idx) => ({
              label: `${idx + 1}. ${sec.title.split('&')[0].trim()} ${
                handover.sections?.[sec.key]?.isComplete ? '✓' : ''
              }`,
              value: sec.key,
            }))}
          />
        </div>

        {/* Desktop / Tablet: Horizontal Segmented Pills */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-900">
          {HANDOVER_SECTIONS.map((sec, idx) => {
            const isCompleted = Boolean(handover.sections?.[sec.key]?.isComplete)
            const isActive = activeSectionKey === sec.key

            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSectionKey(sec.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span>{sec.title.split('&')[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Active Section Markdown Editor */}
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
