import { Input } from '../../../components/ui/Input.jsx'
import { useEmailOtp } from '../hooks/useEmailOtp.js'

export function EmailOtpVerifier({ email, onEmailChange, onVerified, fieldError, initialToken = null }) {
  const {
    status,
    otp,
    setOtp,
    error,
    successMessage,
    cooldown,
    remainingResends,
    sendOtp,
    verifyOtp,
    reset,
  } = useEmailOtp(email, onVerified, initialToken)

  const isVerified = status === 'verified'
  const isLocked = status === 'locked'
  const isCodeSent = status === 'sent' || status === 'verifying' || status === 'locked'
  const isReadOnly = isCodeSent || isVerified || isLocked

  const handleEmailInput = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, '')
    onEmailChange?.(e)
    if (status !== 'idle') {
      reset()
    }
  }

  const handleChangeEmail = () => {
    reset()
    onVerified?.(null)
    setTimeout(() => {
      const el = document.getElementById('email')
      el?.focus()
      el?.select()
    }, 40)
  }

  return (
    <div className="space-y-2">
      <Input
        id="email"
        type="email"
        label="Work Email"
        placeholder="name@company.com"
        value={email}
        onChange={handleEmailInput}
        error={fieldError || (!isCodeSent ? error : '')}
        required
        readOnly={isReadOnly}
        suffix={
          isVerified ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                ✓ Verified
              </span>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-[11px] text-zinc-400 hover:text-white underline transition cursor-pointer select-none ml-1"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={sendOtp}
              disabled={status === 'sending' || cooldown > 0 || isLocked}
              className={`text-xs font-semibold px-2 py-0.5 rounded transition cursor-pointer select-none ${
                status === 'sending' || cooldown > 0 || isLocked
                  ? 'text-zinc-500 cursor-not-allowed'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              {status === 'sending'
                ? 'Sending...'
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : isCodeSent
                ? 'Resend Code'
                : 'Send Code'}
            </button>
          )
        }
      />

      {/* Verification Code Input when sent */}
      {isCodeSent && !isVerified && (
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Verification Code</span>
            <span className="text-zinc-500 text-[11px]">
              {remainingResends > 0 ? `${remainingResends} resends left` : 'No resends left'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="otp-code"
              type="text"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={status === 'verifying' || isLocked}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-center font-mono tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
              autoFocus
            />

            <button
              type="button"
              onClick={verifyOtp}
              disabled={otp.length !== 6 || status === 'verifying' || isLocked}
              className="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            >
              {status === 'verifying' ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          {/* Feedback messages */}
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
          {!error && successMessage && <p className="text-[11px] text-zinc-400">{successMessage}</p>}
        </div>
      )}
    </div>
  )
}
