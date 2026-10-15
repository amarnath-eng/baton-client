import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { loginApi } from '../../services/authApi.js'
import { setCredentials } from '../../store/authSlice.js'

export function LoginForm({ onSubmitSuccess }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (errors.form) setErrors((prev) => ({ ...prev, form: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid work email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const data = await loginApi(formData)
      dispatch(setCredentials(data))
      if (onSubmitSuccess) {
        onSubmitSuccess(data)
      } else {
        navigate('/dashboard')
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
          Sign in to your workspace
        </h1>
        <p className="text-xs text-zinc-400">
          Access your continuous service handovers and operational runbooks.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-left">
            {errors.form}
          </div>
        )}

        {/* Work Email */}
        <Input
          id="email"
          type="email"
          label="Work Email"
          placeholder="amarnath@company.com"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-medium text-zinc-300">
              Password <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-zinc-400 hover:text-white transition cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full justify-center py-2.5 text-sm font-semibold shadow-sm mt-2 group"
        >
          {isSubmitting ? (
            <span>Signing in...</span>
          ) : (
            <span className="inline-flex items-center gap-2 font-semibold text-black">
              <span>Sign In</span>
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
      </form>

      {/* Switch to Register Link & Quiet Return to Home */}
      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900 space-y-2">
        <p>
          Don&apos;t have a workspace?{' '}
          <Link to="/register" className="font-medium text-white hover:underline transition">
            Create Workspace
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
