import { useState } from 'react'
import { Button } from '../../../components/ui/Button.jsx'

export default function HandoverReviewModal({
  isOpen,
  action, // 'approve' | 'request_revision'
  onClose,
  onSubmit,
  loading = false,
}) {
  const [reviewNotes, setReviewNotes] = useState('')
  const [validationError, setValidationError] = useState('')

  if (!isOpen) return null

  const isRevision = action === 'request_revision'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isRevision && !reviewNotes.trim()) {
      setValidationError('Please provide specific feedback explaining what revisions are required.')
      return
    }
    onSubmit(reviewNotes.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl z-10 space-y-5 animate-scale-up">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              {isRevision ? 'Request Handover Revisions' : 'Approve Handover'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isRevision
                ? 'Send this handover back to the outgoing engineer with constructive feedback.'
                : 'Approve this handover to unlock the final sign-off stage for the incoming engineer.'}
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              {isRevision ? 'Revision Feedback *' : 'Review Notes (Optional)'}
            </label>
            <textarea
              rows={4}
              value={reviewNotes}
              onChange={(e) => {
                setReviewNotes(e.target.value)
                setValidationError('')
              }}
              placeholder={
                isRevision
                  ? 'Detail the missing context, unaddressed dependencies, or questions needed before approval...'
                  : 'Add optional sign-off remarks or commendations...'
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none"
            />
            {validationError && (
              <p className="text-[11px] text-rose-400 mt-1">{validationError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-900">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`text-xs ${
                isRevision
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {loading
                ? 'Submitting...'
                : isRevision
                ? 'Request Changes'
                : 'Confirm Approval'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
