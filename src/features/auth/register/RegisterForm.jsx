import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'
import { RequestAccessModal } from '../../access-requests/RequestAccessModal.jsx'
import { RegisterStepWorkspace } from './RegisterStepWorkspace.jsx'
import { RegisterStepAdmin } from './RegisterStepAdmin.jsx'
import { useRegister } from './useRegister.js'
import { useWorkspaceAvailability } from './useWorkspaceAvailability.js'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Single Responsibility: High-level orchestrator for the 2-step company registration flow.
 * Coordinates workspace lookup / collision checks and delegates step views to
 * RegisterStepWorkspace and RegisterStepAdmin.
 */
export function RegisterForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1) // 1: Workspace Check, 2: Admin Registration
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [step1Error, setStep1Error] = useState('')

  const {
    formData,
    verificationToken,
    errors,
    isSubmitting,
    workspaceStatus,
    isEmailVerified,
    isRequestAccessOpen,
    requestAccessTarget,
    setIsRequestAccessOpen,
    setRequestAccessTarget,
    setVerificationToken,
    handleFullNameChange,
    handleEmployeeIdChange,
    handleEmailChange,
    handleCompanyChange,
    handleSlugChange,
    handleWorkspaceStatusChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useRegister({ onSubmitSuccess })

  const { checkAvailability } = useWorkspaceAvailability({
    handleWorkspaceStatusChange,
  })

  // Company Name Change with live automatic slug generation
  const onCompanyNameInput = (e) => {
    setStep1Error('')
    const name = e.target.value
      .replace(/^\s+/, '')
      .replace(/[^a-zA-Z0-9\s.&'-]/g, '')
      .replace(/\s{2,}/g, ' ')

    const newSlug = isSlugManuallyEdited ? formData.workspaceSlug : generateSlug(name)
    handleCompanyChange(name, newSlug)
    checkAvailability(name, newSlug)
  }

  // Workspace Slug Change with formatting
  const onSlugInput = (e) => {
    setStep1Error('')
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+/, '')

    setIsSlugManuallyEdited(true)
    handleSlugChange(slug)
    checkAvailability(formData.companyName, slug)
  }

  // Trigger Request Access modal for a specific company and slug
  const handleOpenRequestAccess = (slug, name) => {
    setRequestAccessTarget({
      slug: slug || formData.workspaceSlug,
      companyName: name || formData.companyName,
    })
    setIsRequestAccessOpen(true)
  }

  // Handle one-click selection of an available suggested slug
  const handleSelectSlug = (suggestedSlug) => {
    setStep1Error('')
    setIsSlugManuallyEdited(true)
    handleSlugChange(suggestedSlug)
    checkAvailability(formData.companyName, suggestedSlug)
  }

  // Handle proceeding from Step 1 to Step 2
  const handleProceedToStep2 = (e) => {
    e.preventDefault()
    if (!formData.companyName.trim()) {
      setStep1Error('Please enter your company name.')
      return
    }
    if (!formData.workspaceSlug.trim() || formData.workspaceSlug.length < 3) {
      setStep1Error('Workspace URL must be at least 3 characters.')
      return
    }
    if (!SLUG_REGEX.test(formData.workspaceSlug)) {
      setStep1Error('Workspace URL can only contain lowercase letters, numbers, and hyphens.')
      return
    }
    if (workspaceStatus.isChecking) {
      return
    }
    if (workspaceStatus.slugExists) {
      setStep1Error(`Workspace URL "${formData.workspaceSlug}" is already registered. Choose an available URL or sign in.`)
      return
    }
    setStep1Error('')
    setStep(2)
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

      {/* Modern 2-Step Progress Tracker */}
      <div className="space-y-1.5 pb-1 text-left">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-white' : 'bg-zinc-800'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-white' : 'bg-zinc-800'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span className={step === 1 ? 'text-zinc-200 font-medium' : 'text-zinc-600'}>
            01 &middot; Company Workspace
          </span>
          <span className={step === 2 ? 'text-zinc-200 font-medium' : 'text-zinc-600'}>
            02 &middot; Administrator Setup
          </span>
        </div>
      </div>

      {/* STEP 1: Workspace Lookup & Collision Gate */}
      {step === 1 && (
        <RegisterStepWorkspace
          formData={formData}
          errors={errors}
          workspaceStatus={workspaceStatus}
          step1Error={step1Error}
          onCompanyNameInput={onCompanyNameInput}
          onSlugInput={onSlugInput}
          handleProceedToStep2={handleProceedToStep2}
          handleOpenRequestAccess={handleOpenRequestAccess}
          handleSelectSlug={handleSelectSlug}
        />
      )}

      {/* STEP 2: Administrator Profile & Account Setup */}
      {step === 2 && (
        <RegisterStepAdmin
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          isEmailVerified={isEmailVerified}
          setStep={setStep}
          handleSubmit={handleSubmit}
          handleFullNameChange={handleFullNameChange}
          handleEmployeeIdChange={handleEmployeeIdChange}
          handleEmailChange={handleEmailChange}
          setVerificationToken={setVerificationToken}
          handlePasswordChange={handlePasswordChange}
          handleConfirmPasswordChange={handleConfirmPasswordChange}
        />
      )}

      {/* Request Access Modal */}
      <RequestAccessModal
        isOpen={isRequestAccessOpen}
        onClose={() => setIsRequestAccessOpen(false)}
        companySlug={requestAccessTarget.slug || formData.workspaceSlug}
        companyName={requestAccessTarget.companyName || formData.companyName}
        initialFullName={formData.fullName}
        initialEmail={formData.email}
        initialVerificationToken={verificationToken}
      />
    </div>
  )
}
