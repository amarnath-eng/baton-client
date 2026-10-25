import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'
import { Input } from '../../../components/ui/Input.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import { EmailOtpVerifier } from '../components/EmailOtpVerifier.jsx'
import { RequestAccessModal } from '../../access-requests/RequestAccessModal.jsx'
import { WorkspaceCollisionCard } from './WorkspaceCollisionCard.jsx'
import { useRegister } from './useRegister.js'
import { checkSlugApi } from '../../../services/companyApi.js'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function RegisterForm({ onSubmitSuccess }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  
  const slugCheckTimerRef = useRef(null)
  const slugAbortControllerRef = useRef(null)

  // Clean up in-flight debounce timer and request on unmount
  useEffect(() => {
    return () => {
      if (slugCheckTimerRef.current) {
        clearTimeout(slugCheckTimerRef.current)
      }
      if (slugAbortControllerRef.current) {
        slugAbortControllerRef.current.abort()
      }
    }
  }, [])

  const {
    formData,
    verificationToken,
    errors,
    isSubmitting,
    slugStatus,
    isEmailVerified,
    isRequestAccessOpen,
    setIsRequestAccessOpen,
    setVerificationToken,
    handleFullNameChange,
    handleEmailChange,
    handleCompanyChange,
    handleSlugChange,
    handleSlugStatusChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useRegister({ onSubmitSuccess })

  // Company Name Change with live automatic slug generation
  const onCompanyNameInput = (e) => {
    const name = e.target.value
      .replace(/^\s+/, '')
      .replace(/[^a-zA-Z0-9\s.&'-]/g, '')
      .replace(/\s{2,}/g, ' ')

    const newSlug = isSlugManuallyEdited ? formData.workspaceSlug : generateSlug(name)
    handleCompanyChange(name, newSlug)
    checkSlugCollision(newSlug)
  }

  // Workspace Slug Change with formatting
  const onSlugInput = (e) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+/, '')

    setIsSlugManuallyEdited(true)
    handleSlugChange(slug)
    checkSlugCollision(slug)
  }

  // Real-time debounced slug collision check with AbortController
  const checkSlugCollision = (slug) => {
    if (slugCheckTimerRef.current) {
      clearTimeout(slugCheckTimerRef.current)
    }
    if (slugAbortControllerRef.current) {
      slugAbortControllerRef.current.abort()
    }

    if (!slug || slug.length < 3 || !SLUG_REGEX.test(slug)) {
      handleSlugStatusChange({ isChecking: false, exists: false, companyName: '' })
      return
    }

    slugCheckTimerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      slugAbortControllerRef.current = controller

      try {
        handleSlugStatusChange((prev) => ({ ...prev, isChecking: true }))
        const res = await checkSlugApi(slug, { signal: controller.signal })
        if (!controller.signal.aborted) {
          handleSlugStatusChange({
            isChecking: false,
            exists: Boolean(res.exists),
            companyName: res.companyName || '',
          })
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        handleSlugStatusChange({ isChecking: false, exists: false, companyName: '' })
      }
    }, 450)
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

      {/* Form Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Create your engineering workspace
        </h1>
        <p className="text-xs text-zinc-400">
          Get started with role-verified handovers and zero orphan tasks.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
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

        {/* Email & OTP Verification */}
        <EmailOtpVerifier
          email={formData.email}
          onEmailChange={handleEmailChange}
          onVerified={setVerificationToken}
          fieldError={errors.email}
        />

        {/* Company Name */}
        <Input
          id="companyName"
          label="Company or Team Name"
          placeholder="Enter company name"
          value={formData.companyName}
          onChange={onCompanyNameInput}
          error={errors.companyName}
          required
        />

        {/* Workspace Slug */}
        <Input
          id="workspaceSlug"
          label="Workspace URL"
          prefix="app.baton.dev/"
          placeholder="workspace-slug"
          value={formData.workspaceSlug}
          onChange={onSlugInput}
          error={errors.workspaceSlug}
          required
        />

        {/* Workspace Collision Alert Card */}
        {slugStatus.exists && (
          <WorkspaceCollisionCard
            slug={formData.workspaceSlug}
            companyName={slugStatus.companyName}
            onRequestAccess={() => setIsRequestAccessOpen(true)}
          />
        )}

        {/* Downstream Credentials & Creation (Soft-locked when slug is taken) */}
        <div
          className={`space-y-4 transition-all duration-300 ${slugStatus.exists
              ? 'opacity-30 pointer-events-none select-none grayscale'
              : 'opacity-100'
            }`}
        >
          {/* Password */}
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Create a password (min. 8 characters)"
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
                className="w-7 h-7 rounded-lg bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700/70 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer select-none"
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
            disabled={isSubmitting || !isEmailVerified || slugStatus.exists}
            className="w-full justify-center py-2.5 text-sm font-semibold shadow-sm mt-2 group"
          >
            {isSubmitting ? (
              <span>Creating workspace...</span>
            ) : (
              <span className="inline-flex items-center gap-2 font-semibold text-black">
                <span>Create Workspace</span>
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
            By continuing, you register as the primary workspace administrator.
          </p>
        </div>
      </form>

      {/* Switch to Login Link & Quiet Return to Home */}
      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900 space-y-2">
        {!slugStatus.exists && (
          <p>
            Already have a workspace?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-white hover:underline transition">
              Sign In
            </Link>
          </p>
        )}

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
            <span>Back to home</span>
          </Link>
        </div>
      </div>

      {/* Request Access Modal */}
      <RequestAccessModal
        isOpen={isRequestAccessOpen}
        onClose={() => setIsRequestAccessOpen(false)}
        companySlug={formData.workspaceSlug}
        companyName={slugStatus.companyName}
        initialFullName={formData.fullName}
        initialEmail={formData.email}
        initialVerificationToken={verificationToken}
      />
    </div>
  )
}
