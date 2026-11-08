import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/Button.jsx'
import { Input } from '../../../components/ui/Input.jsx'
import { Shimmer } from '../../../components/ui/Shimmer.jsx'
import { Modal } from '../../../components/ui/Modal.jsx'
import { useCreateHandoverForm } from '../hooks/useCreateHandoverForm.js'

/**
 * Single Responsibility: Presentational modal for creating a new engineering handover.
 * Coordinates user input fields and delegates member loading, validation, and submission
 * to useCreateHandoverForm.
 */
export default function CreateHandoverModal({ isOpen, onClose, onCreated }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 640
    return false
  })

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    members,
    title,
    setTitle,
    project,
    setProject,
    reason,
    setReason,
    deadline,
    setDeadline,
    outgoingEngineerId,
    setOutgoingEngineerId,
    incomingEngineerId,
    setIncomingEngineerId,
    loadingMembers,
    submitting,
    error,
    handleSubmit,
  } = useCreateHandoverForm({ isOpen, onClose, onCreated })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Handover"
      subtitle="Initialize a role-verified engineering continuity workflow."
      maxWidth="max-w-lg"
    >
      {error && (
        <div className="shrink-0 mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4">
          <Input
            label="Handover Title"
            type="text"
            placeholder="e.g. Payments Service Handover"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Project / Service"
              type="text"
              placeholder="e.g. Core Payments"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            />

            <Input
              label="Target Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Handover Reason / Context <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Transitioning ownership to Data Platform team..."
              required
              className="w-full min-h-[75px] max-h-[160px] resize-y rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          {/* Engineer Selectors */}
          {loadingMembers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Shimmer className="h-3 w-28" rounded="rounded" />
                <Shimmer className="h-9 w-full" rounded="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Shimmer className="h-3 w-28" rounded="rounded" />
                <Shimmer className="h-9 w-full" rounded="rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Outgoing Engineer <span className="text-rose-400">*</span>
                </label>
                <select
                  value={outgoingEngineerId}
                  onChange={(e) => setOutgoingEngineerId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                    {isMobile ? 'Select outgoing...' : 'Select outgoing engineer...'}
                  </option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                      {isMobile ? m.fullName : `${m.fullName} (${m.role})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Incoming Engineer <span className="text-rose-400">*</span>
                </label>
                <select
                  value={incomingEngineerId}
                  onChange={(e) => setIncomingEngineerId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                    {isMobile ? 'Select incoming...' : 'Select incoming engineer...'}
                  </option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                      {isMobile ? m.fullName : `${m.fullName} (${m.role})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="shrink-0 flex items-center justify-end gap-2.5 pt-4 mt-6 border-t border-zinc-800/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 sm:flex-initial sm:w-40 justify-center"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={submitting}
            className="flex-1 sm:flex-initial sm:w-40 justify-center"
          >
            Initialize Handover
          </Button>
        </div>
      </form>
    </Modal>
  )
}
