import { useState, useEffect } from 'react'
import { getCompanyMembersApi } from '../../../services/companyApi.js'
import { createHandoverApi } from '../../../services/handoverApi.js'
import { Button } from '../../../components/ui/Button.jsx'
import { Input } from '../../../components/ui/Input.jsx'

export default function CreateHandoverModal({ isOpen, onClose, onCreated }) {
  const [members, setMembers] = useState([])
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [reason, setReason] = useState('')
  const [deadline, setDeadline] = useState('')
  const [outgoingEngineerId, setOutgoingEngineerId] = useState('')
  const [incomingEngineerId, setIncomingEngineerId] = useState('')

  const [loadingMembers, setLoadingMembers] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    setTitle('')
    setProject('')
    setReason('')
    setDeadline('')
    setOutgoingEngineerId('')
    setIncomingEngineerId('')
    setError(null)

    let isActive = true
    setLoadingMembers(true)

    async function loadMembers() {
      try {
        const data = await getCompanyMembersApi()
        if (!isActive) return

        setMembers(data)
      } catch (err) {
        if (!isActive) return
        setError(err?.message || 'Failed to load workspace members.')
      } finally {
        if (isActive) {
          setLoadingMembers(false)
        }
      }
    }

    loadMembers()

    return () => {
      isActive = false
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !project.trim() || !reason.trim() || !deadline) {
      setError('Please fill in all required fields.')
      return
    }

    if (!outgoingEngineerId || !incomingEngineerId) {
      setError('Please assign both outgoing and incoming engineers.')
      return
    }

    if (outgoingEngineerId === incomingEngineerId) {
      setError('Outgoing and incoming engineers cannot be the same person.')
      return
    }

    setSubmitting(true)
    try {
      const response = await createHandoverApi({
        title: title.trim(),
        project: project.trim(),
        reason: reason.trim(),
        deadline,
        outgoingEngineerId,
        incomingEngineerId,
      })

      onCreated?.(response)
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to initialize handover.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-2xl relative text-left">
        {/* Fixed Header */}
        <div className="shrink-0 flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Create New Handover
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Initialize a role-verified engineering continuity workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition p-1.5 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="shrink-0 mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Outgoing Engineer <span className="text-rose-400">*</span>
                </label>
                <select
                  value={outgoingEngineerId}
                  onChange={(e) => setOutgoingEngineerId(e.target.value)}
                  disabled={loadingMembers}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                    Select outgoing engineer...
                  </option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                      {m.fullName} ({m.role})
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
                  disabled={loadingMembers}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                    Select incoming engineer...
                  </option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                      {m.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fixed Footer Action Buttons */}
          <div className="shrink-0 flex items-center justify-end gap-2.5 pt-4 mt-4 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Initialize Handover
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
