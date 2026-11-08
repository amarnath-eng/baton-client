import { OtpInput } from '../../../components/ui/OtpInput.jsx'

/**
 * Single Responsibility: Renders the 6-digit OTP entry container, including
 * segmented inputs, resend rate-limit feedback, verify button, error banner,
 * and email delivery troubleshooting assistance.
 */
export function OtpVerificationPanel({
  compact,
  otp,
  setOtp,
  isVerifyDisabled,
  verifyOtp,
  status,
  isLocked,
  error,
  isResending,
  cooldown,
  formattedCooldown,
  remainingResends,
  handleResend,
  handleChangeEmail,
  hasResent,
}) {
  return (
    <div
      className={`rounded-xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
        compact
          ? 'p-3 bg-zinc-900/50 border-zinc-800 space-y-2.5'
          : 'p-3.5 sm:p-4 sm:rounded-2xl bg-zinc-950/90 border-zinc-800/90 shadow-2xl space-y-3.5'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-xs">
        <span className={`font-medium text-zinc-200 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          Verification Code
        </span>
        <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">
          6 digits sent to your email
        </span>
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
  )
}

