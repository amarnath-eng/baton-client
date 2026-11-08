import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useInviteMemberForm } from './hooks/useInviteMemberForm.js'

/**
 * Single Responsibility: Presentational modal dialog for inviting or re-inviting
 * team members to the workspace. Delegates form state and validation to useInviteMemberForm.
 */
export default function InviteMemberModal({ isOpen, onClose, onInvitationCreated, initialData = null }) {
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
    name,
    email,
    employeeId,
    role,
    setRole,
    message,
    setMessage,
    employeeIdError,
    emailError,
    isCheckingEmpId,
    alreadyMember,
    pendingExists,
    companyName,
    loading,
    error,
    generatedInvite,
    availableRoles,
    handleNameChange,
    handleEmailChange,
    handleEmployeeIdChange,
    handleEmployeeIdBlur,
    handleSubmit,
  } = useInviteMemberForm({ isOpen, initialData, onInvitationCreated })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Re-invite Team Member' : 'Invite Team Member'}
      subtitle={
        initialData
          ? `Dispatch a refreshed 7-day invitation link to ${initialData.name || initialData.email}.`
          : 'Send a 7-day role-verified invitation link to join your workspace.'
      }
      maxWidth="max-w-lg"
    >
      {error && !alreadyMember && !pendingExists && !employeeIdError && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
          {error}
        </div>
      )}

      {generatedInvite ? (
        /* Clean Confirmation (Link logged to console, never displayed in UI) */
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black text-xs font-bold shrink-0">
                ✓
              </span>
              <p className="text-sm font-semibold text-emerald-300">
                Invitation Dispatched Successfully
              </p>
            </div>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              An invitation email has been dispatched to <strong className="text-white">{email}</strong>{' '}
              {employeeId && <>({employeeId}) </>}with assigned role{' '}
              <strong className="text-white capitalize">{role}</strong>.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
            <Button type="button" size="sm" variant="primary" onClick={onClose} className="w-full sm:w-auto">
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-3">
          {alreadyMember && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2 text-xs text-amber-300 text-left animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span>This user is already an active member of {companyName || 'this workspace'}.</span>
            </div>
          )}

          {pendingExists && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 text-left animate-in fade-in">
              An active invitation or access request is already pending for this email.
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={handleNameChange}
            required
          />

          <Input
            label="Employee ID"
            type="text"
            placeholder="e.g. EMP-1042"
            value={employeeId}
            inputClassName="font-mono tracking-wider uppercase"
            onChange={handleEmployeeIdChange}
            onBlur={handleEmployeeIdBlur}
            error={employeeIdError}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            required
          />

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Role & Permissions
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-zinc-500 focus:outline-none cursor-pointer"
            >
              {availableRoles.map((r) => (
                <option key={r.value} value={r.value} className="bg-zinc-900 text-white">
                  {isMobile ? r.shortLabel : r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Personal Welcome Note (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Welcome to the continuity team..."
              className="w-full min-h-[52px] resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 mt-1 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              disabled={loading || isCheckingEmpId || Boolean(employeeIdError)}
            >
              Dispatch Invitation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
