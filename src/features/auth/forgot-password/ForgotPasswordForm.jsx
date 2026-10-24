import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../../components/ui/Input.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import { EmailOtpVerifier } from '../components/EmailOtpVerifier.jsx'
import { sendPasswordResetOtpApi, resetPasswordApi } from '../../../services/authApi.js'
import { ROUTES } from '../../../routes/paths.js'

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Smart password input: block leading spaces, allow Diceware multi-word passphrases
  const handlePasswordKeyDown = (e) => {
    if (e.key === ' ' && !password) {
      e.preventDefault()
    }
  }

  const handleConfirmPasswordKeyDown = (e) => {
    if (e.key === ' ' && !confirmPassword) {
      e.preventDefault()
    }
  }

  const handlePasswordInput = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setPassword(val)
    if (error) setError('')
  }

  const handleConfirmPasswordInput = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setConfirmPassword(val)
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!verificationToken) {
      setError('Please verify your work email with the OTP code first.')
      return
    }

    const cleanPassword = password.trim()
    const cleanConfirm = confirmPassword.trim()

    if (!cleanPassword || cleanPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      return
    }

    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match. Please re-enter your new password.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      await resetPasswordApi({
        email: email.trim(),
        password: cleanPassword,
        verificationToken,
      })
      setIsSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. Success Screen once password is reset
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-sm">
          ✓
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Password Reset Successfully!
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your account password has been updated. You can now sign in to your workspace with your new credentials.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition active:scale-95 shadow-sm"
          >
            Sign In to Workspace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Mobile-only brand header */}
      <div className="lg:hidden text-center pb-2">
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white font-bold text-black text-sm shadow-sm">
            B
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">Baton</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Reset your password
        </h1>
        <p className="text-xs text-zinc-400 leading-normal">
          Verify your registered work email with a one-time code to set a new password.
        </p>
      </div>

      {/* Form Error Banner */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 animate-in fade-in duration-150">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Step 1: Work Email Verification with OTP */}
        <EmailOtpVerifier
          email={email}
          initialToken={verificationToken}
          sendOtpFn={sendPasswordResetOtpApi}
          onEmailChange={(e) => {
            setEmail(e.target.value.replace(/\s+/g, ''))
            setVerificationToken(null)
            setError('')
          }}
          onVerified={(token) => {
            setVerificationToken(token)
            setError('')
          }}
        />

        {/* Step 2: Set New Password (unlocked once email is verified) */}
        {verificationToken && (
          <div className="space-y-3.5 pt-2 border-t border-zinc-900 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1 text-left">
              <span className="text-xs font-semibold text-zinc-200">Set New Password</span>
              <p className="text-[11px] text-zinc-500">Choose a secure password of at least 8 characters.</p>
            </div>

            {/* New Password */}
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordInput}
              onKeyDown={handlePasswordKeyDown}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 p-1 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Confirm New Password */}
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordInput}
              onKeyDown={handleConfirmPasswordKeyDown}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-zinc-500 hover:text-zinc-300 p-1 transition"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Submit Button */}
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || password.length < 8 || password !== confirmPassword}
                className="w-full justify-center text-xs py-2.5 font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Switch to Login / Return to Home */}
      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900 space-y-2">
        <p>
          Remember your password?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-white hover:underline transition">
            Sign In
          </Link>
        </p>

        <div>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group font-medium"
          >
            <svg
              className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
