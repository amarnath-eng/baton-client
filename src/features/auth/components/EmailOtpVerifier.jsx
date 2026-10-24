import { useState } from 'react'
import { Input } from '../../../components/ui/Input.jsx'
import { OtpInput } from '../../../components/ui/OtpInput.jsx'
import { useEmailOtp } from '../hooks/useEmailOtp.js'

export function EmailOtpVerifier({ email, onEmailChange, onVerified, fieldError, initialToken = null, compact = false, sendOtpFn = null }) {
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
        <div className={`rounded-xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
          compact
            ? 'p-3 bg-zinc-900/50 border-zinc-800 space-y-2.5'
            : 'p-3.5 sm:p-4 sm:rounded-2xl bg-zinc-950/90 border-zinc-800/90 shadow-2xl space-y-3.5'
        }`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-xs">
            <span className={`font-medium text-zinc-200 ${compact ? 'text-[11px]' : 'text-xs'}`}>Verification Code</span>
            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">6 digits sent to your email</span>
          </div>

          {/* Segmented OTP Boxes with auto-advance, backspace, and Enter-key verification */}
          <div className="py-0.5">
            <OtpInput
              value={otp}
              onChange={setOtp}
              onEnter={() => {
                if (!isVerifyDisabled) {
                  verifyOtp()
                }
              }}
              disabled={status === 'verifying' || isLocked}
              hasError={Boolean(error)}
              autoFocus
              compact={compact}
            />
          </div>

          {/* Action Row: Clean Resend + Real Solid Verify Button */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="text-[11px]">
              {isResending ? (
                <span className="inline-flex items-center gap-1.5 text-zinc-400 font-medium">
                  <span className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin shrink-0"></span>
                  <span>Resending...</span>
                </span>
              ) : isLocked ? (
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="text-rose-400 font-medium">Verification locked</span>
                  {cooldown > 0 && (
                    <span className="text-zinc-400 text-[10px]">
                      Try again in <span className="text-white font-semibold">{formattedCooldown}</span>
                    </span>
                  )}
                </div>
              ) : remainingResends <= 0 ? (
                cooldown > 0 ? (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 text-[11px] tabular-nums leading-tight">
                    <span className="text-rose-400 font-medium whitespace-nowrap">Resend limit reached</span>
                    <span className="hidden sm:inline text-zinc-600">·</span>
                    <span className="text-zinc-400 text-[10px] sm:text-[11px] whitespace-nowrap">
                      Available in <span className="text-white font-semibold">{formattedCooldown}</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-rose-400 font-medium">Resend limit reached</span>
                )
              ) : cooldown > 0 ? (
                <span className="inline-flex items-baseline gap-1 text-[11px] tabular-nums">
                  <span className="text-zinc-400">Resend in</span>
                  <span className="text-white font-semibold">{formattedCooldown}</span>
                  <span className="text-zinc-500 text-[10px] hidden xs:inline">({remainingResends} left)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={status === 'sending' || isResending}
                  className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 px-2 py-1 rounded-lg transition cursor-pointer"
                >
                  Resend code ({remainingResends} left)
                </button>
              )}
            </div>

            {/* Real Solid Verify Button */}
            {status === 'verifying' ? (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium px-3 py-1.5 shrink-0">
                <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => verifyOtp()}
                disabled={isVerifyDisabled}
                className={`rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold shadow-sm transition active:scale-95 disabled:opacity-30 disabled:hover:bg-white cursor-pointer select-none shrink-0 ${
                  compact ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
                }`}
              >
                Verify Code
              </button>
            )}
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 animate-in fade-in duration-150">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Actionable Assistance Card when Resend Clicked, 1 Resend Left, or Limit Reached */}
          {(hasResent || isLocked || remainingResends <= 1) && (
            compact ? (
              <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80 text-[11px] text-zinc-400">
                <span>Didn't receive? Check spam.</span>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="inline-flex items-center gap-1.5 text-white hover:text-zinc-200 font-medium transition cursor-pointer group text-xs shrink-0"
                >
                  <span>Change Email</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{isLocked || remainingResends <= 1 ? "Didn't receive the verification code?" : "Didn't receive the first code?"}</span>
                </div>
                <ul className="space-y-1.5 text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1 shrink-0" />
                    <span>Check your <span className="text-zinc-200">Spam</span>, <span className="text-zinc-200">Junk</span>, or <span className="text-zinc-200">Promotions</span> folder.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1 shrink-0" />
                    <span>Corporate security filters (Mimecast, Defender) can delay external emails.</span>
                  </li>
                </ul>
                <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 border-t border-zinc-800/80">
                  <span className="text-[11px] text-zinc-500">Made a typo or want another address?</span>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="inline-flex items-center gap-1.5 text-white hover:text-zinc-200 font-medium transition cursor-pointer group text-xs self-start sm:self-auto shrink-0"
                  >
                    <span>Change Email</span>
                    <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
