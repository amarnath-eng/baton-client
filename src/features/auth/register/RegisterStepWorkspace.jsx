import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'
import { Input } from '../../../components/ui/Input.jsx'
import { Button } from '../../../components/ui/Button.jsx'
import { WorkspaceCollisionCard } from './WorkspaceCollisionCard.jsx'

/**
 * Single Responsibility: Step 1 of registration — collects company name and slug,
 * validates availability, and displays collision warning cards with request access options.
 */
export function RegisterStepWorkspace({
  formData,
  errors,
  workspaceStatus,
  step1Error,
  onCompanyNameInput,
  onSlugInput,
  handleProceedToStep2,
  handleOpenRequestAccess,
  handleSelectSlug,
}) {
  const isSlugTaken = workspaceStatus.slugExists
  const isNameCollision = workspaceStatus.nameExists
  const isBothCollision =
    isSlugTaken &&
    (isNameCollision ||
      workspaceStatus.slugCompany?.name?.toLowerCase() === formData.companyName.trim().toLowerCase())
  const isNameExistsButSlugAvailable =
    isNameCollision && !isSlugTaken && formData.workspaceSlug.length >= 3

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Find or create your workspace
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Check if your company is already active on Baton before setting up a new company workspace.
        </p>
      </div>

      <form onSubmit={handleProceedToStep2} className="space-y-4" autoComplete="off">
        {step1Error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 text-left">
            {step1Error}
          </div>
        )}

        {/* Company Name */}
        <Input
          id="companyName"
          label="Company Name"
          placeholder="e.g. Acme Technologies"
          value={formData.companyName}
          onChange={onCompanyNameInput}
          error={errors.companyName}
          required
        />

        {/* Workspace Slug */}
        <Input
          id="workspaceSlug"
          label="Workspace URL"
          prefix="batondev.in/"
          placeholder="acme-technologies"
          value={formData.workspaceSlug}
          inputClassName="font-mono tracking-[0.025em]"
          onChange={onSlugInput}
          error={errors.workspaceSlug}
          required
        />

        {/* Collision Case 1: Slug is Taken */}
        {isSlugTaken && (
          <WorkspaceCollisionCard
            type={isBothCollision ? 'name_and_slug_collision' : 'slug_collision'}
            currentSlug={formData.workspaceSlug}
            currentCompanyName={formData.companyName}
            existingCompany={workspaceStatus.slugCompany || workspaceStatus.nameCompany}
            onRequestAccess={handleOpenRequestAccess}
            onSelectSlug={handleSelectSlug}
          />
        )}

        {/* Collision Case 2: Company Name exists, BUT User Entered a Unique Slug */}
        {isNameExistsButSlugAvailable && (
          <WorkspaceCollisionCard
            type="name_exists_slug_unique"
            currentSlug={formData.workspaceSlug}
            currentCompanyName={formData.companyName}
            existingCompany={workspaceStatus.nameCompany}
            onRequestAccess={handleOpenRequestAccess}
            onSelectSlug={handleSelectSlug}
          />
        )}

        {/* Clean Case: Available for Registration */}
        {!isSlugTaken && formData.workspaceSlug.length >= 3 && (
          <div className="space-y-3 pt-1">
            {!isNameCollision && (
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-medium truncate">
                    <code className="text-white font-mono font-semibold">batondev.in/{formData.workspaceSlug}</code> is available.
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold shrink-0">
                  Available
                </span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={workspaceStatus.isChecking}
              className="w-full justify-center py-2.5 text-sm font-semibold shadow-sm group"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-black">
                <span>{workspaceStatus.isChecking ? 'Checking availability...' : 'Continue to Admin Setup'}</span>
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
            </Button>
          </div>
        )}
      </form>

      {/* Quick Sign In Link for existing users */}
      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900 space-y-2">
        <p>
          Already have a workspace account?{' '}
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
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

