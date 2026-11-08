import { Link } from 'react-router-dom'
import { buildRoute } from '../../routes/paths.js'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { EmailOtpVerifier } from '../auth/components/EmailOtpVerifier.jsx'
import { RolePreferenceSelector } from './RolePreferenceSelector.jsx'
import { RequestAccessSuccess } from './RequestAccessSuccess.jsx'
import { useRequestAccessForm } from './hooks/useRequestAccessForm.js'

/**
 * Single Responsibility: Presentational modal dialog for requesting access to a company workspace.
 * Delegates form state, OTP validation, and submission logic to useRequestAccessForm.
 */
export function RequestAccessModal({
  isOpen,
  onClose,
  companySlug,
  companyName,
  initialFullName = '',
  initialEmail = '',
  initialVerificationToken = null,
}) {
  const {
    fullName,
    handleFullNameChange,
    email,
    handleEmailChange,
    employeeId,
    employeeIdError,
    handleEmployeeIdChange,
    handleEmployeeIdBlur,
    role,
    setRole,
    verificationToken,
    isEmailVerified,
    handleEmailVerified,
    handleSendOtp,
    isSubmitting,
    alreadyMember,
    pendingExists,
    error,
    isSubmitted,
    handleSubmit,
    handleModalClose,
  } = useRequestAccessForm({
    isOpen,
    companySlug,
    initialFullName,
    initialEmail,
    initialVerificationToken,
    onClose,
  })

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
        <RequestAccessSuccess
          companySlug={companySlug}
          companyName={companyName}
          role={role}
          onClose={handleModalClose}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          {/* Workspace Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span>Workspace:</span>
            <span className="font-mono font-semibold tracking-wide">{companySlug}</span>
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
            onChange={handleFullNameChange}
            required
          />

          {/* Employee ID with onBlur DB verification */}
          <Input
            id="req-employeeId"
            label="Employee ID"
            placeholder="e.g. EMP-1042"
            value={employeeId}
            inputClassName="font-mono tracking-wider uppercase"
            onChange={handleEmployeeIdChange}
            onBlur={handleEmployeeIdBlur}
            error={employeeIdError}
            required
          />

          {/* Work Email & OTP Verifier with member pre-check */}
          <EmailOtpVerifier
            email={email}
            initialToken={verificationToken}
            compact={true}
            sendOtpFn={handleSendOtp}
            onEmailChange={handleEmailChange}
            onVerified={handleEmailVerified}
          />

          {/* Role Preference Selector */}
          <RolePreferenceSelector
            role={role}
            onChange={setRole}
          />

          {/* Action CTA Footer */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            {alreadyMember ? (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2 text-xs text-amber-300 text-left">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span>You are already an active member of {companyName || companySlug}.</span>
                </div>
                <Link
                  to={buildRoute.loginWithWorkspace(companySlug)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-semibold transition active:scale-98 shadow-sm group"
                >
                  <span>Sign In to Workspace</span>
                  <svg className="w-4 h-4 text-black transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ) : pendingExists ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 text-left animate-in fade-in">
                You already have a pending access request for this company. An administrator will review your request shortly.
              </div>
            ) : (
              <>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    isSubmitting ||
                    !isEmailVerified ||
                    !fullName.trim() ||
                    !employeeId.trim() ||
                    Boolean(employeeIdError)
                  }
                  className="w-full justify-center py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Access Request'}
                </Button>
                {!isEmailVerified && (
                  <p className="text-[11px] text-zinc-500 text-center mt-1.5">
                    Please verify your work email above before submitting.
                  </p>
                )}
              </>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}
