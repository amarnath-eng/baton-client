import { useState } from 'react'
import { Input } from '../../../components/ui/Input.jsx'
import { useEmailOtp } from '../hooks/useEmailOtp.js'
import { OtpVerificationPanel } from './OtpVerificationPanel.jsx'

/**
 * Single Responsibility: Coordinates work email entry and OTP status gating,
 * delegating code verification UI and troubleshooting help to OtpVerificationPanel.
 */
export function EmailOtpVerifier({
  email,
  onEmailChange,
  onVerified,
  fieldError,
  initialToken = null,
  compact = false,
  sendOtpFn = null,
}) {
  const {
    status,
    isResending,
    otp,
    setOtp,
    isVerifyDisabled,
    error,
    cooldown,
    formattedCooldown,
    remainingResends,
    sendOtp,
    verifyOtp,
    reset,
  } = useEmailOtp(email, onVerified, initialToken, sendOtpFn)

  const [hasResent, setHasResent] = useState(false)

  const isVerified = status === 'verified'
  const isLocked = status === 'locked'
  const isCodeSent = status === 'sent' || status === 'verifying' || status === 'locked'
  const isReadOnly = isCodeSent || isVerified || isLocked

  const handleResend = () => {
    setHasResent(true)
    sendOtp()
  }

  const handleEmailKeyDown = (e) => {
    // Strictly forbid spacebar key press anywhere in email
    if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
      e.preventDefault()
      return
    }

    // Trigger OTP dispatch when hitting Enter in the email box
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!isCodeSent && !isVerified && status !== 'sending' && cooldown === 0 && !isLocked && email?.trim()) {
        sendOtp()
      }
    }
  }

  const handleEmailPaste = (e) => {
    e.preventDefault()
    const clean = e.clipboardData.getData('text').replace(/\s+/g, '').toLowerCase()
    e.target.value = clean
    onEmailChange?.(e)
    if (status !== 'idle') {
      reset()
    }
  }

  const handleEmailInput = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, '').toLowerCase()
    onEmailChange?.(e)
    setHasResent(false)
    reset()
  }

  const handleChangeEmail = () => {
    setHasResent(false)
    reset()
    onVerified?.(null)
    setTimeout(() => {
      const el = document.getElementById('email')
      el?.focus()
      el?.select()
    }, 40)
  }

  return (
    <div className="space-y-3">
      {/* 1. Email Field or Verified Identity Tile (Industry Standard: Clerk / Linear / Stripe) */}
      {isVerified ? (
        <div className="space-y-1.5 text-left animate-in fade-in duration-200">
          <label className="block text-xs font-medium text-zinc-300">
            Work Email <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-100 truncate">
                {email}
              </span>
            </div>

            <button
              type="button"
              onClick={handleChangeEmail}
              title="Change email"
              aria-label="Change email"
              className="w-7 h-7 rounded-lg bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer select-none shrink-0 ml-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <Input
          id="email"
          type="email"
          label="Work Email"
          placeholder="name@company.com"
          value={email}
          onChange={handleEmailInput}
          onKeyDown={handleEmailKeyDown}
          onPaste={handleEmailPaste}
          error={fieldError || (!isCodeSent ? error : '')}
          required
          readOnly={isReadOnly}
          suffix={
            isCodeSent ? (
              <button
                type="button"
                onClick={handleChangeEmail}
                title="Change email"
                aria-label="Change email"
                className="w-7 h-7 rounded-lg bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer select-none shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                disabled={status === 'sending' || cooldown > 0 || isLocked || !email?.trim()}
                className={`inline-flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-lg border transition-all select-none tabular-nums ${
                  cooldown > 0
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 cursor-not-allowed shadow-none'
                    : status === 'sending' || isLocked || !email?.trim()
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/80 hover:text-white hover:border-zinc-600 active:scale-95 shadow-sm cursor-pointer'
                }`}
              >
                {status === 'sending' ? (
                  <>
                    <span className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
                    <span>Sending...</span>
                  </>
                ) : cooldown > 0 ? (
                  <span className="text-zinc-200 font-medium tabular-nums">
                    Wait {formattedCooldown}
                  </span>
                ) : (
                  'Send Code'
                )}
              </button>
            )
          }
        />
      )}

      {/* 2. Enterprise Segmented 6-Digit PIN Box */}
      {isCodeSent && !isVerified && (
        <OtpVerificationPanel
          compact={compact}
          otp={otp}
          setOtp={setOtp}
          isVerifyDisabled={isVerifyDisabled}
          verifyOtp={verifyOtp}
          status={status}
          isLocked={isLocked}
          error={error}
          isResending={isResending}
          cooldown={cooldown}
          formattedCooldown={formattedCooldown}
          remainingResends={remainingResends}
          handleResend={handleResend}
          handleChangeEmail={handleChangeEmail}
          hasResent={hasResent}
        />
      )}
    </div>
  )
}
