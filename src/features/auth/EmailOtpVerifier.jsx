import { Input } from '../../components/ui/Input.jsx'
import { useEmailOtp } from './useEmailOtp.js'

export function EmailOtpVerifier({ email, onEmailChange, onVerified, fieldError }) {
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
  } = useEmailOtp(email, onVerified)

  const isVerified = status === 'verified'
  const isLocked = status === 'locked'
  const isCodeSent = status === 'sent' || status === 'verifying' || status === 'locked'

  const handleEmailInput = (e) => {
    onEmailChange?.(e)
    if (status !== 'idle') {
      reset()
    }
  }

  return (
    <div className="space-y-2">
      <Input
        id="email"
        type="email"
        label="Work Email"
        placeholder="amarnath@company.com"
        value={email}
        onChange={handleEmailInput}
        error={fieldError}
        required
        disabled={isVerified || isLocked}
        suffix={
          isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              ✓ Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={sendOtp}
              disabled={status === 'sending' || cooldown > 0 || isLocked || !email}
              className="text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 px-2.5 py-1 rounded-lg transition border border-zinc-700/60 cursor-pointer"
            >
              {status === 'sending'
                ? 'Sending...'
                : isCodeSent
                ? cooldown > 0
                  ? `Resend (${cooldown}s)`
                  : 'Resend'
                : 'Verify'}
            </button>
          )
        }
      />

      {/* Expandable 6-digit OTP Box */}
      {isCodeSent && !isVerified && (
        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2.5 text-left animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-300">Enter 6-digit verification code</span>
            {remainingResends < 3 && (
              <span className="text-[11px] text-zinc-500">{remainingResends} resends left</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              disabled={isLocked}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={status === 'verifying' || otp.length !== 6 || isLocked}
              className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              {status === 'verifying' ? 'Checking...' : 'Verify Code'}
            </button>
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}
          {successMessage && !error && <p className="text-[11px] text-emerald-400">{successMessage}</p>}
        </div>
      )}
    </div>
  )
}
