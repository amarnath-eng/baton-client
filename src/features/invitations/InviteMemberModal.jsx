import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { createInvitationApi } from '../../services/invitationApi.js'
import { Button } from '../../components/ui/Button.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { USER_ROLES } from '../../constants/roles.js'

export default function InviteMemberModal({ isOpen, onClose, onInvitationCreated }) {
  const { role: currentUserRole } = useSelector((state) => state.auth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [role, setRole] = useState(USER_ROLES.ENGINEER)
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedInvite, setGeneratedInvite] = useState(null)
  const [copied, setCopied] = useState(false)
  const abortControllerRef = useRef(null)

  // Clean up in-flight invite request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

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

  // Allowed roles based on role hierarchy
  const availableRoles = currentUserRole === USER_ROLES.ADMIN
    ? [
        { value: USER_ROLES.ENGINEER, label: 'Engineer — Continuous handover contributor', shortLabel: 'Engineer' },
        { value: USER_ROLES.MANAGER, label: 'Engineering Manager — Reviews & signs off handovers', shortLabel: 'Engineering Manager' },
        { value: USER_ROLES.ADMIN, label: 'Admin — Full workspace control & team management', shortLabel: 'Admin' },
      ]
    : [
        { value: USER_ROLES.ENGINEER, label: 'Engineer — Continuous handover contributor', shortLabel: 'Engineer' },
      ]

  useEffect(() => {
    if (isOpen) {
      setName('')
      setEmail('')
      setEmployeeId('')
      setRole(USER_ROLES.ENGINEER)
      setMessage('')
      setError(null)
      setGeneratedInvite(null)
      setCopied(false)
    }
  }, [isOpen])

  // Live sanitization for member name: disallow leading spaces
  function handleNameChange(e) {
    const raw = e.target.value
    if (raw.startsWith(' ')) return
    setName(raw)
  }

  // Live sanitization for email: disallow all whitespace
  function handleEmailChange(e) {
    setEmail(e.target.value.replace(/\s+/g, ''))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please provide the team member’s name.')
      return
    }
    if (!employeeId.trim()) {
      setError('Please provide the team member’s Employee ID.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid work email address.')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    try {
      const response = await createInvitationApi(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          employeeId: employeeId.trim().toUpperCase() || undefined,
          role,
          message: message.trim() || undefined,
        },
        { signal: controller.signal }
      )

      if (!controller.signal.aborted) {
        if (response?.inviteUrl) {
          console.log('[Baton Invitation Link]:', response.inviteUrl)
        }
        setGeneratedInvite(response)
        onInvitationCreated?.(response)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err?.message || 'Failed to dispatch team invitation.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  async function handleCopyLink() {
    if (!generatedInvite?.inviteUrl) return
    try {
      await navigator.clipboard.writeText(generatedInvite.inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      subtitle="Send a 7-day role-verified invitation link to join your workspace."
      maxWidth="max-w-lg"
    >
      {error && (
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
            onChange={(e) => setEmployeeId(e.target.value.replace(/^\s+/, '').toUpperCase())}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={handleEmailChange}
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
            >
              Dispatch Invitation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
