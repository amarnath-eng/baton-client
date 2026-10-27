import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/paths.js'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { EmailOtpVerifier } from '../auth/components/EmailOtpVerifier.jsx'
import { RolePreferenceSelector } from './RolePreferenceSelector.jsx'
import { RequestAccessSuccess } from './RequestAccessSuccess.jsx'
import { submitAccessRequestApi } from '../../services/accessRequestApi.js'
import { USER_ROLES } from '../../constants/roles.js'

export function RequestAccessModal({
  isOpen,
  onClose,
  companySlug,
  companyName,
  initialFullName = '',
  initialEmail = '',
  initialVerificationToken = null,
}) {
  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)
  const [role, setRole] = useState(USER_ROLES.ENGINEER)
  const [verificationToken, setVerificationToken] = useState(initialVerificationToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const abortControllerRef = useRef(null)

  const handleModalClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (isSubmitted) {
      navigate(ROUTES.HOME, { replace: true })
    } else {
      onClose?.()
    }
  }

  // Synchronize latest values from parent whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(initialFullName || '')
      setEmail(initialEmail || '')
      setVerificationToken(initialVerificationToken || null)
      setError('')
      setIsSubmitted(false)
    }
  }, [isOpen, initialFullName, initialEmail, initialVerificationToken])

  // Clear any existing modal-level error whenever email changes
  useEffect(() => {
    setError('')
  }, [email])

  // Clean up in-flight request on unmount to prevent React memory leaks
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const isEmailVerified = Boolean(verificationToken)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!isEmailVerified) {
      setError('Please verify your work email with OTP first')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsSubmitting(true)
      setError('')
      await submitAccessRequestApi(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          companySlug,
          role,
          verificationToken,
        },
        { signal: controller.signal }
      )
      if (!controller.signal.aborted) {
        setIsSubmitted(true)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return
      }
      setError(err.message || 'Failed to submit access request.')
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false)
      }
    }
  }

  const modalTitle = isSubmitted
    ? 'Request Confirmation'
    : `Request to join ${companyName || companySlug}`

  const modalSubtitle = isSubmitted
    ? 'Your submission receipt and next steps.'
    : 'Ask a workspace administrator to approve your access and assign your role.'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      maxWidth="max-w-[490px]"
    >
      {isSubmitted ? (
        /* Success Screen Subcomponent */
        <RequestAccessSuccess
          companySlug={companySlug}
          companyName={companyName}
          role={role}
          onClose={handleModalClose}
        />
      ) : (
        /* Request Form */
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          {/* Workspace Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span>Workspace:</span>
            <span className="font-mono font-semibold">{companySlug}</span>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Full Name */}
          <Input
            id="req-fullName"
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              const val = e.target.value
                .replace(/^\s+/, '')
                .replace(/[^a-zA-Z\s.'-]/g, '')
                .replace(/\s{2,}/g, ' ')
              setFullName(val)
            }}
            required
          />

          {/* Work Email & OTP Verifier in Compact Modal Mode */}
          <EmailOtpVerifier
            email={email}
            initialToken={verificationToken}
            compact={true}
            onEmailChange={(e) => {
              const cleanEmail = e.target.value.replace(/\s+/g, '')
              setEmail(cleanEmail)
              setVerificationToken(null)
              setError('')
            }}
            onVerified={(token) => {
              setVerificationToken(token)
              setError('')
            }}
          />

          {/* Role Preference Selector */}
          <RolePreferenceSelector
            role={role}
            onChange={setRole}
          />

          {/* Action CTA Footer */}
          <div className="pt-2 border-t border-zinc-800/80">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isEmailVerified || !fullName.trim()}
              className="w-full justify-center py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Access Request'}
            </Button>
            {!isEmailVerified && (
              <p className="text-[11px] text-zinc-500 text-center mt-1.5">
                Please verify your work email above before submitting.
              </p>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}
