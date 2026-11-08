import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { createInvitationApi } from '../../../services/invitationApi.js'
import { checkEmployeeIdInCompanyApi } from '../../../services/accessRequestApi.js'
import { USER_ROLES } from '../../../constants/roles.js'

/**
 * Single Responsibility: Manages state, validation, real-time employee ID checks,
 * and dispatch orchestration for the member invitation modal.
 */
export function useInviteMemberForm({ isOpen, initialData, onInvitationCreated }) {
  const { role: currentUserRole, company } = useSelector((state) => state.auth)
  const companySlug = company?.slug
  const companyName = company?.name

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [role, setRole] = useState(USER_ROLES.ENGINEER)
  const [message, setMessage] = useState('')

  const [employeeIdError, setEmployeeIdError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isCheckingEmpId, setIsCheckingEmpId] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const [pendingExists, setPendingExists] = useState(false)
  const lastCheckedEmpIdRef = useRef('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedInvite, setGeneratedInvite] = useState(null)
  const [copied, setCopied] = useState(false)
  const abortControllerRef = useRef(null)

  // Clean up in-flight invite request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '')
      setEmail(initialData?.email || '')
      setEmployeeId(initialData?.employeeId || '')
      setEmployeeIdError('')
      setEmailError('')
      setRole(initialData?.role || USER_ROLES.ENGINEER)
      setMessage('')
      setError(null)
      setGeneratedInvite(null)
      setCopied(false)
      setAlreadyMember(false)
      setPendingExists(false)
      lastCheckedEmpIdRef.current = initialData?.employeeId || ''
    }
  }, [isOpen, initialData])

  // Live sanitization for member name: disallow leading spaces
  function handleNameChange(e) {
    const raw = e.target.value
    if (raw.startsWith(' ')) return
    setName(raw)
  }

  // Live sanitization for email: disallow all whitespace
  function handleEmailChange(e) {
    setEmail(e.target.value.replace(/\s+/g, ''))
    setEmailError('')
    setAlreadyMember(false)
    setPendingExists(false)
  }

  // Live sanitization for employee ID
  function handleEmployeeIdChange(e) {
    setEmployeeId(e.target.value.replace(/^\s+/, '').toUpperCase())
    setEmployeeIdError('')
  }

  // Real-time Employee ID availability check on blur
  const handleEmployeeIdBlur = async () => {
    const cleanId = employeeId.trim().toUpperCase()
    if (!cleanId || !companySlug || cleanId === lastCheckedEmpIdRef.current) return

    try {
      setIsCheckingEmpId(true)
      setEmployeeIdError('')
      const res = await checkEmployeeIdInCompanyApi({
        companySlug,
        employeeId: cleanId,
      })
      lastCheckedEmpIdRef.current = cleanId

      if (res?.exists) {
        setEmployeeIdError(
          res.message || `Employee ID "${cleanId}" is already assigned to a member in this company.`
        )
      }
    } catch {
      // Don't block
    } finally {
      setIsCheckingEmpId(false)
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault?.()
    setError(null)
    setEmailError('')

    if (!name.trim()) {
      setError('Please provide the team member’s name.')
      return
    }
    const cleanEmpId = employeeId.trim().toUpperCase()
    if (!cleanEmpId) {
      setError('Please provide the team member’s Employee ID.')
      return
    }
    if (employeeIdError) {
      setError('Please provide a unique Employee ID for this company.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid work email address.')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Final pre-flight Employee ID check if changed
    if (companySlug && cleanEmpId !== lastCheckedEmpIdRef.current) {
      try {
        const res = await checkEmployeeIdInCompanyApi(
          { companySlug, employeeId: cleanEmpId },
          { signal: controller.signal }
        )
        lastCheckedEmpIdRef.current = cleanEmpId
        if (res?.exists) {
          setEmployeeIdError(
            res.message || `Employee ID "${cleanEmpId}" is already assigned to a member in this company.`
          )
          setError('Please provide a unique Employee ID for this company.')
          return
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) return
      }
    }

    setLoading(true)
    try {
      const response = await createInvitationApi(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          employeeId: cleanEmpId,
          role,
          message: message.trim() || undefined,
        },
        { signal: controller.signal }
      )

      if (!controller.signal.aborted) {
        if (response?.inviteUrl) {
          console.log('[Baton Invitation Link]:', response.inviteUrl)
        }
        setGeneratedInvite(response)
        onInvitationCreated?.(response)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      const errMsg = err?.message || 'Failed to dispatch team invitation.'
      setError(errMsg)

      const errPayload = err?.errors || {}
      if (errPayload.field === 'employeeId' || errMsg.includes('Employee ID')) {
        setEmployeeIdError(errMsg)
      }
      if (errPayload.alreadyMember || errMsg.includes('already an active member')) {
        setAlreadyMember(true)
        setEmailError(errMsg)
      } else if (errPayload.pendingExists || errMsg.includes('already pending')) {
        setPendingExists(true)
        setEmailError(errMsg)
      } else if (errPayload.pendingRequestExists || errMsg.includes('pending access request')) {
        setPendingExists(true)
        setEmailError(errMsg)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  async function handleCopyLink() {
    if (!generatedInvite?.inviteUrl) return
    try {
      await navigator.clipboard.writeText(generatedInvite.inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Allowed roles based on role hierarchy
  const availableRoles = currentUserRole === USER_ROLES.ADMIN
    ? [
        { value: USER_ROLES.ENGINEER, label: 'Engineer — Continuous handover contributor', shortLabel: 'Engineer' },
        { value: USER_ROLES.MANAGER, label: 'Engineering Manager — Reviews & signs off handovers', shortLabel: 'Engineering Manager' },
        { value: USER_ROLES.ADMIN, label: 'Admin — Full workspace control & team management', shortLabel: 'Admin' },
      ]
    : [
        { value: USER_ROLES.ENGINEER, label: 'Engineer — Continuous handover contributor', shortLabel: 'Engineer' },
      ]

  return {
    name,
    email,
    employeeId,
    role,
    setRole,
    message,
    setMessage,
    employeeIdError,
    emailError,
    isCheckingEmpId,
    alreadyMember,
    pendingExists,
    companyName,
    loading,
    error,
    generatedInvite,
    copied,
    availableRoles,
    handleNameChange,
    handleEmailChange,
    handleEmployeeIdChange,
    handleEmployeeIdBlur,
    handleSubmit,
    handleCopyLink,
  }
}
