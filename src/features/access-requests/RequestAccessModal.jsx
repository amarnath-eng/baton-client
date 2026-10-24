import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/paths.js'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { EmailOtpVerifier } from '../auth/components/EmailOtpVerifier.jsx'
import { RolePreferenceSelector } from './RolePreferenceSelector.jsx'
import { RequestAccessSuccess } from './RequestAccessSuccess.jsx'
import { submitAccessRequestApi } from '../../services/accessRequestApi.js'

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
  const [role, setRole] = useState('engineer')
  const [verificationToken, setVerificationToken] = useState(initialVerificationToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleModalClose = () => {
    if (isSubmitted) {
      navigate(ROUTES.HOME, { replace: true })
    } else {
      onClose?.()
    }
  }

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isOpen])

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

  if (!isOpen) return null

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

    try {
      setIsSubmitting(true)
      setError('')
      await submitAccessRequestApi({
        fullName: fullName.trim(),
        email: email.trim(),
        companySlug,
        role,
        verificationToken,
      })
      setIsSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 pt-6 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md sm:max-w-[490px] max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl text-left overflow-hidden animate-in zoom-in-95 duration-200 my-auto sm:my-0">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="w-7 h-7 rounded-lg bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs absolute top-3.5 sm:top-4 right-3.5 sm:right-4 cursor-pointer select-none z-10"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          /* Success Screen Subcomponent */
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            <RequestAccessSuccess
              companySlug={companySlug}
              companyName={companyName}
              role={role}
              onClose={handleModalClose}
            />
          </div>
        ) : (
          /* Request Form */
          <>
            {/* Pinned Header */}
            <div className="p-4 sm:px-5 sm:py-3.5 shrink-0 border-b border-zinc-800/60">
              <div className="space-y-0.5">
                <div className="pr-9">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                    <span>Workspace:</span>
                    <span className="font-mono font-semibold">{companySlug}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    Request to join {companyName || companySlug}
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 w-full pt-0.5 leading-normal">
                  Ask a workspace administrator to approve your access and assign your role.
                </p>
              </div>
            </div>

            {/* Form with Scrollable Body and Pinned Footer */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden" autoComplete="off">
              {/* Internal Scrollable Content Area */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 sm:space-y-3.5">
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
              </div>

              {/* Pinned Bottom CTA Footer */}
              <div className="p-3.5 sm:px-5 sm:py-3.5 border-t border-zinc-800/80 bg-zinc-950/95 shrink-0">
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
          </>
        )}
      </div>
    </div>
  )
}
