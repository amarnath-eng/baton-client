import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuthSession } from '../../store/authSlice.js'
import { verifyInviteTokenApi, acceptInviteApi } from '../../services/invitationApi.js'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ROUTES } from '../../routes/paths.js'
import { Shimmer } from '../../components/ui/Shimmer.jsx'
import { useDeferredLoading } from '../../hooks/useDeferredLoading.js'
import { USER_ROLES } from '../../constants/roles.js'

export function AcceptInviteCard() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const showSkeleton = useDeferredLoading(loading, { delayMs: 150, minDurationMs: 300 })
  const [inviteData, setInviteData] = useState(null)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const submitAbortControllerRef = useRef(null)

  // Clean up in-flight submission on unmount
  useEffect(() => {
    return () => {
      if (submitAbortControllerRef.current) {
        submitAbortControllerRef.current.abort()
      }
    }
  }, [])

  // 1. Verify token on initial mount
  useEffect(() => {
    if (!token) {
      setError('Invitation token is missing from the link.')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function verify() {
      try {
        setLoading(true)
        setError('')
        const data = await verifyInviteTokenApi(token, { signal: controller.signal })
        if (!controller.signal.aborted) {
          setInviteData(data)
          setFullName(data.name || '')
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        setError(err.message || 'Invalid or expired invitation link.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    verify()

    return () => {
      controller.abort()
    }
  }, [token])

  // 2. Handle form submission (Accept & Join)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return

    if (!inviteData?.userExists && !fullName.trim()) {
      setSubmitError('Please enter your full name.')
      return
    }

    if (!password || password.length < 8) {
      setSubmitError('Password must be at least 8 characters.')
      return
    }

    if (submitAbortControllerRef.current) {
      submitAbortControllerRef.current.abort()
    }
    const controller = new AbortController()
    submitAbortControllerRef.current = controller

    try {
      setSubmitting(true)
      setSubmitError('')
      await acceptInviteApi(
        {
          token,
          fullName: fullName.trim(),
          password,
        },
        { signal: controller.signal }
      )

      if (!controller.signal.aborted) {
        // Refresh auth state in Redux store
        await dispatch(checkAuthSession())
        navigate(ROUTES.DASHBOARD)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setSubmitError(err.message || 'Failed to accept invitation.')
    } finally {
      if (!controller.signal.aborted) {
        setSubmitting(false)
      }
    }
  }

  // Loading Shimmer Skeleton State (Zero layout shift, no flash)
  if (showSkeleton) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1.5 flex flex-col items-center">
          <Shimmer className="h-3 w-32" rounded="rounded" />
          <Shimmer className="h-7 w-24" rounded="rounded-md" />
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl space-y-6">
          <div className="space-y-2.5 text-center pb-4 border-b border-zinc-900 flex flex-col items-center">
            <Shimmer className="h-5 w-24" rounded="rounded-full" />
            <Shimmer className="h-6 w-48" rounded="rounded-md" />
            <Shimmer className="h-3.5 w-64" rounded="rounded" />
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-16" rounded="rounded" />
              <Shimmer className="h-10 w-full" rounded="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-16" rounded="rounded" />
              <Shimmer className="h-10 w-full" rounded="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-28" rounded="rounded" />
              <Shimmer className="h-10 w-full" rounded="rounded-xl" />
            </div>
            <Shimmer className="h-10 w-full mt-2" rounded="rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Error / Expired Link State
  if (error || !inviteData) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl border border-rose-500/20 bg-zinc-950/90 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 text-xl font-bold">
          !
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Invitation Link Invalid or Expired
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {error || 'This invitation link is no longer valid or has already expired.'}
          </p>
        </div>
        <div className="pt-2 space-y-2.5">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
          >
            Sign In to Existing Account
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition"
          >
            Register a New Workspace
          </Link>
          <p className="text-[11px] text-zinc-500 text-center pt-1">
            Need a fresh invite? Ask your workspace lead to dispatch a new link.
          </p>
        </div>
      </div>
    )
  }

  const roleBadgeColors = {
    [USER_ROLES.ADMIN]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    [USER_ROLES.MANAGER]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [USER_ROLES.ENGINEER]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          Engineering Continuity
        </span>
        <h1 className="text-2xl font-black tracking-tight text-white">Baton</h1>
      </div>

      {/* Invitation Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Workspace Info */}
        <div className="space-y-2 text-center pb-4 border-b border-zinc-900">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
              roleBadgeColors[inviteData.role] || roleBadgeColors.engineer
            }`}
          >
            Role: {inviteData.role}
          </span>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Join {inviteData.company?.name || 'Workspace'}
          </h2>

          <p className="text-xs text-zinc-400">
            Workspace URL:{' '}
            <span className="font-mono text-zinc-300">
              setpoint.team/{inviteData.company?.slug}
            </span>
          </p>

          {/* Optional Personal Message */}
          {inviteData.message && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 italic text-left">
              "{inviteData.message}"
            </div>
          )}
        </div>

        {/* Form Alert Error */}
        {submitError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {submitError}
          </div>
        )}

        {/* Account Acceptance Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Invited Email */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-400">Invited Email</label>
            <div className="px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-300 font-mono select-all">
              {inviteData.email}
            </div>
          </div>

          {/* Full Name (Only required for new users) */}
          {!inviteData.userExists && (
            <Input
              id="inv-fullName"
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                const val = e.target.value
                  .replace(/^\s+/, '')
                  .replace(/[^a-zA-Z\s.'-]/g, '')
                  .replace(/\s{2,}/g, ' ')
                setFullName(val)
              }}
              required
            />
          )}

          {/* Password */}
          <Input
            id="inv-password"
            type={showPassword ? 'text' : 'password'}
            label={
              inviteData.userExists
                ? 'Confirm Your Baton Password'
                : 'Create a Password (min. 8 characters)'
            }
            placeholder={
              inviteData.userExists
                ? 'Enter your existing password'
                : 'Create a secure password'
            }
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/^\s+/, ''))}
            required
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-zinc-400 hover:text-white transition px-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
          />

          {inviteData.userExists && (
            <p className="text-[11px] text-zinc-500 leading-normal">
              You already have a Baton account with this email. Entering your password will link
              this new workspace to your account.
            </p>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full justify-center py-2.5 text-sm font-semibold"
            >
              {submitting
                ? 'Joining Workspace...'
                : inviteData.userExists
                ? `Accept & Join ${inviteData.company?.name || 'Workspace'}`
                : `Create Account & Join ${inviteData.company?.name || 'Workspace'}`}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer info */}
      <p className="text-center text-[11px] text-zinc-600">
        Already a member of another workspace?{' '}
        <Link to={ROUTES.LOGIN} className="text-zinc-400 hover:text-white underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
