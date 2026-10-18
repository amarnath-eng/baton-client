import { useState, useEffect } from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl text-left space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          /* Success Screen Subcomponent */
          <RequestAccessSuccess
            companySlug={companySlug}
            companyName={companyName}
            role={role}
            onClose={onClose}
          />
        ) : (
          /* Request Form */
          <>
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                <span>Workspace:</span>
                <span className="font-mono font-semibold">{companySlug}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Request to join {companyName || companySlug}
              </h2>
              <p className="text-xs text-zinc-400">
                Ask a workspace administrator to approve your access and assign your role.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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

              {/* Work Email & OTP Verifier */}
              <EmailOtpVerifier
                email={email}
                initialToken={verificationToken}
                onEmailChange={(e) => {
                  const cleanEmail = e.target.value.replace(/\s+/g, '')
                  setEmail(cleanEmail)
                  setVerificationToken(null)
                }}
                onVerified={(token) => setVerificationToken(token)}
              />

              {/* Role Preference Selector */}
              <RolePreferenceSelector
                role={role}
                onChange={setRole}
              />

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !isEmailVerified || !fullName.trim()}
                  className="w-full justify-center py-2.5 text-sm font-semibold"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Access Request'}
                </Button>
                {!isEmailVerified && (
                  <p className="text-[11px] text-zinc-500 text-center mt-2">
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
