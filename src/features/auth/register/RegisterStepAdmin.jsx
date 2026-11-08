import { useState } from 'react'
import { Input } from '../../../components/ui/Input.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import { EmailOtpVerifier } from '../components/EmailOtpVerifier.jsx'

/**
 * Single Responsibility: Step 2 of registration — collects administrator personal details,
 * email verification with OTP, employee ID, and password configuration.
 */
export function RegisterStepAdmin({
  formData,
  errors,
  isSubmitting,
  isEmailVerified,
  setStep,
  handleSubmit,
  handleFullNameChange,
  handleEmployeeIdChange,
  handleEmailChange,
  setVerificationToken,
  handlePasswordChange,
  handleConfirmPasswordChange,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Selected Workspace Badge */}
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-left shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 font-semibold text-xs tracking-wider">
            {formData.companyName.slice(0, 2).toUpperCase() || 'CO'}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-white block truncate">{formData.companyName}</span>
            <span className="text-[11px] text-zinc-500 font-mono block truncate">
              batondev.in/{formData.workspaceSlug}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-800 transition cursor-pointer shrink-0"
        >
          Change
        </button>
      </div>

      {/* Step 2 Heading */}
      <div className="space-y-1 text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Create administrator account
        </h1>
        <p className="text-xs text-zinc-400">
          Set up your credentials to activate and manage continuous engineering handovers.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-left">
            {errors.form}
          </div>
        )}

        {/* Full Name */}
        <Input
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleFullNameChange}
          error={errors.fullName}
          required
        />

        {/* Employee ID */}
        <Input
          id="employeeId"
          label="Employee ID"
          placeholder="e.g. EMP-1042"
          value={formData.employeeId}
          inputClassName="font-mono tracking-wider uppercase"
          onChange={handleEmployeeIdChange}
          error={errors.employeeId}
          required
        />

        {/* Email & OTP Verification */}
        <EmailOtpVerifier
          email={formData.email}
          onEmailChange={handleEmailChange}
          onVerified={setVerificationToken}
          fieldError={errors.email}
        />

        {/* Password */}
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handlePasswordChange}
          onKeyDown={(e) => {
            if (e.key === ' ' && !formData.password) {
              e.preventDefault()
            }
          }}
          error={errors.password}
          required
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="w-7 h-7 rounded-lg bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer select-none"
            >
              {showPassword ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="3" x2="21" y2="21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          }
        />

        {/* Confirm Password */}
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          onKeyDown={(e) => {
            if (e.key === ' ' && !formData.confirmPassword) {
              e.preventDefault()
            }
          }}
          error={errors.confirmPassword}
          required
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="w-7 h-7 rounded-lg bg-zinc-855 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer select-none"
            >
              {showConfirmPassword ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="3" x2="21" y2="21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          }
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !isEmailVerified}
          className="w-full justify-center py-2.5 text-sm font-semibold shadow-sm mt-2 group"
        >
          {isSubmitting ? (
            <span>Creating workspace...</span>
          ) : (
            <span className="inline-flex items-center gap-2 font-semibold text-black">
              <span>Create Workspace & Account</span>
              <svg
                className="w-4 h-4 shrink-0 text-black transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          )}
        </Button>

        {/* Micro-copy terms */}
        <p className="text-[11px] text-zinc-500 text-center">
          You will be registered as the primary company workspace administrator with full permissions.
        </p>
      </form>
    </div>
  )
}

