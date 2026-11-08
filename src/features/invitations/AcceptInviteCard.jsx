import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ROUTES } from '../../routes/paths.js'
import { USER_ROLES } from '../../constants/roles.js'
import { useAcceptInvite } from './hooks/useAcceptInvite.js'
import { AcceptInviteSkeleton } from './components/AcceptInviteSkeleton.jsx'
import { AcceptInviteError } from './components/AcceptInviteError.jsx'

const ROLE_BADGE_COLORS = {
  [USER_ROLES.ADMIN]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  [USER_ROLES.MANAGER]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [USER_ROLES.ENGINEER]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

/**
 * Single Responsibility: Presentational card for accepting a workspace invitation.
 * Coordinates input fields and delegates verification, loading, and error states.
 */
export function AcceptInviteCard() {
  const {
    showSkeleton,
    inviteData,
    error,
    fullName,
    setFullName,
    employeeId,
    setEmployeeId,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    submitting,
    submitError,
    handleSubmit,
  } = useAcceptInvite()

  if (showSkeleton) {
    return <AcceptInviteSkeleton />
  }

  if (error || !inviteData) {
    return <AcceptInviteError error={error} />
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          Engineering Continuity
        </span>
        <h1 className="text-2xl font-black tracking-wide text-white">Baton</h1>
      </div>

      {/* Invitation Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Workspace Info */}
        <div className="space-y-2 text-center pb-4 border-b border-zinc-900">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
              ROLE_BADGE_COLORS[inviteData.role] || ROLE_BADGE_COLORS[USER_ROLES.ENGINEER]
            }`}
          >
            Role: {inviteData.role}
          </span>

          <h2 className="text-xl font-bold tracking-normal text-white">
            Join {inviteData.company?.name || 'Workspace'}
          </h2>

          <p className="text-xs text-zinc-400">
            Workspace URL:{' '}
            <span className="font-mono text-zinc-300">
              batondev.in/{inviteData.company?.slug}
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

          {/* Employee ID */}
          <Input
            id="inv-employeeId"
            label="Employee ID"
            placeholder="e.g. EMP-1042"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value.replace(/^\s+/, '').toUpperCase())}
            required
          />

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
