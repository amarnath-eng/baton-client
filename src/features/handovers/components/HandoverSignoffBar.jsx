import { Button } from '../../../components/ui/Button.jsx'
import { HANDOVER_STATUS } from '../../../constants/handover.js'

export default function HandoverSignoffBar({
  handover,
  canSubmitForReview,
  canReview,
  canAcknowledge,
  allSectionsComplete,
  completedSectionsCount,
  actionLoading,
  onSubmitForReview,
  onOpenReviewModal,
  onAcknowledge,
}) {
  const status = handover?.status

  // 1. Revision Feedback Banner (if previously sent back with review notes)
  const reviewNotes = handover?.managerReview?.reviewNotes
  const hasRevisionNotes = status === HANDOVER_STATUS.REVISION_REQUESTED && reviewNotes

  return (
    <div className="space-y-4">
      {/* Revision callout if returned by manager */}
      {hasRevisionNotes && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 flex items-start gap-3.5">
          <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-rose-300">
              Manager Revision Feedback
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
              "{reviewNotes}"
            </p>
          </div>
        </div>
      )}

      {/* Main Lifecycle Action Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Handover Lifecycle Stage
            </h4>
          </div>

          <p className="text-xs text-zinc-400 mt-1 max-w-lg">
            {status === HANDOVER_STATUS.DRAFT &&
              'Begin documenting all 6 technical sections to advance into preparation.'}
            {status === HANDOVER_STATUS.IN_PREPARATION &&
              `Complete all 6 sections (${completedSectionsCount}/6 completed) to submit this handover for manager review.`}
            {status === HANDOVER_STATUS.REVISION_REQUESTED &&
              'Address the requested changes and resubmit for manager review.'}
            {status === HANDOVER_STATUS.SUBMITTED_FOR_REVIEW &&
              'Handover is awaiting engineering manager approval.'}
            {status === HANDOVER_STATUS.READY_FOR_ACKNOWLEDGEMENT &&
              'Handover is approved. Waiting for the incoming engineer to acknowledge and complete sign-off.'}
            {status === HANDOVER_STATUS.COMPLETED &&
              `Knowledge transfer completed on ${new Date(
                handover.acknowledgedAt || handover.updatedAt
              ).toLocaleDateString()}. Continuity achieved!`}
          </p>
        </div>

        {/* Action Buttons based on RBAC */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Outgoing Submit Button */}
          {canSubmitForReview && (
            <Button
              type="button"
              disabled={actionLoading || !allSectionsComplete}
              onClick={onSubmitForReview}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {actionLoading ? 'Submitting...' : 'Submit for Manager Review'}
            </Button>
          )}

          {/* Manager Review Actions */}
          {canReview && (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={() => onOpenReviewModal('request_revision')}
                className="text-xs text-rose-400 border-rose-900/40 hover:bg-rose-950/20"
              >
                Request Changes
              </Button>
              <Button
                type="button"
                disabled={actionLoading}
                onClick={() => onOpenReviewModal('approve')}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Approve Handover
              </Button>
            </>
          )}

          {/* Incoming Engineer Sign-Off Action */}
          {canAcknowledge && (
            <Button
              type="button"
              disabled={actionLoading}
              onClick={onAcknowledge}
              className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-cyan-900/20 shadow-md"
            >
              {actionLoading ? 'Signing off...' : 'Acknowledge & Sign Off'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
