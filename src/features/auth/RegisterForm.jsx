import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { EmailOtpVerifier } from './EmailOtpVerifier.jsx'
import { registerApi } from '../../services/authApi.js'

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function RegisterForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    workspaceSlug: '',
    password: '',
    confirmPassword: '',
  })

  const [verificationToken, setVerificationToken] = useState(null)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEmailVerified = Boolean(verificationToken)

  const handleCompanyChange = (e) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      companyName: name,
      workspaceSlug: isSlugManuallyEdited ? prev.workspaceSlug : generateSlug(name),
    }))

    if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }))
    if (errors.workspaceSlug && !isSlugManuallyEdited) {
      setErrors((prev) => ({ ...prev, workspaceSlug: '' }))
    }
  }

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true)
    setFormData((prev) => ({ ...prev, workspaceSlug: generateSlug(e.target.value) }))
    if (errors.workspaceSlug) setErrors((prev) => ({ ...prev, workspaceSlug: '' }))
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleEmailChange = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }))
    setVerificationToken(null)
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Work email is required'
    else if (!isEmailVerified) newErrors.email = 'Please verify your work email with OTP first'

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.workspaceSlug.trim()) newErrors.workspaceSlug = 'Workspace slug is required'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const data = await registerApi({
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName,
        workspaceSlug: formData.workspaceSlug,
        password: formData.password,
        verificationToken,
      })

      if (onSubmitSuccess) {
        onSubmitSuccess(data)
      } else {
        alert(`Workspace "${data.company.name}" created successfully! Owner logged in.`)
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Mobile-only brand header */}
      <div className="lg:hidden text-center pb-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {errors.form}
          </div>
        )}

        {/* Full Name */}
        <Input
          id="fullName"
          label="Full Name"
          placeholder="Amarnath"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          required
        />

        {/* Email & OTP Verification (SRP Subcomponent) */}
        <EmailOtpVerifier
          email={formData.email}
          onEmailChange={handleEmailChange}
          onVerified={(token) => setVerificationToken(token)}
          fieldError={errors.email}
        />

        {/* Company / Organization Name */}
        <Input
          id="companyName"
          label="Company or Team Name"
          placeholder="Acme Payments"
          value={formData.companyName}
          onChange={handleCompanyChange}
          error={errors.companyName}
          required
        />

        {/* Real-time Workspace Slug Preview */}
        <Input
          id="workspaceSlug"
          label="Workspace URL"
          prefix="app.baton.dev/"
          placeholder="acme-payments"
          value={formData.workspaceSlug}
          onChange={handleSlugChange}
          error={errors.workspaceSlug}
          required
        />

        {/* Password */}
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          required
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-zinc-400 hover:text-white transition cursor-pointer select-none px-1"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        {/* Confirm Password */}
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="••••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          required
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-zinc-400 hover:text-white transition cursor-pointer select-none px-1"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
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
      </form>

      {/* Switch to Login Link & Quiet Return to Home */}
      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900 space-y-2">
        <p>
          Already have a workspace?{' '}
          <Link to="/login" className="font-medium text-white hover:underline transition">
            Log In
          </Link>
        </p>

        <div>
          <Link
            to="/"
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
    </div>
  )
}
