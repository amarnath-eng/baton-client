import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths.js'
import {
  submitAccessRequestApi,
  checkEmployeeIdInCompanyApi,
  sendAccessRequestOtpApi,
} from '../../../services/accessRequestApi.js'
import { USER_ROLES } from '../../../constants/roles.js'

/**
 * Single Responsibility: Manages state, validation, OTP verification,
 * and submission logic for an Access Request to a company workspace.
 */
export function useRequestAccessForm({
  isOpen,
  companySlug,
  initialFullName = '',
  initialEmail = '',
  initialVerificationToken = null,
  onClose,
}) {
  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)
  const [employeeId, setEmployeeId] = useState('')
  const [employeeIdError, setEmployeeIdError] = useState('')
  const [isCheckingEmpId, setIsCheckingEmpId] = useState(false)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const [pendingExists, setPendingExists] = useState(false)
  const [role, setRole] = useState(USER_ROLES.ENGINEER)
  const [verificationToken, setVerificationToken] = useState(initialVerificationToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const navigate = useNavigate()
  const abortControllerRef = useRef(null)
  const empCheckPromiseRef = useRef(null)
  const lastCheckedEmpIdRef = useRef('')

  const handleModalClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (isSubmitted) {
      navigate(ROUTES.HOME, { replace: true })
    } else {
      onClose?.()
    }
  }

  // Synchronize latest values from parent whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(initialFullName || '')
      setEmail(initialEmail || '')
      setEmployeeId('')
      setEmployeeIdError('')
      setIsCheckingEmpId(false)
      setAlreadyMember(false)
      setPendingExists(false)
      setVerificationToken(initialVerificationToken || null)
      setError('')
      setIsSubmitted(false)
    }
  }, [isOpen, initialFullName, initialEmail, initialVerificationToken])

  // Clear any existing modal-level error whenever email changes
  useEffect(() => {
    setError('')
  }, [email])

  // Clean up in-flight request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const isEmailVerified = Boolean(verificationToken)

  const handleFullNameChange = (e) => {
    const val = e.target.value
      .replace(/^\s+/, '')
      .replace(/[^a-zA-Z\s.'-]/g, '')
      .replace(/\s{2,}/g, ' ')
    setFullName(val)
  }

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value.replace(/^\s+/, '').toUpperCase())
    setEmployeeIdError('')
  }

  const handleEmailChange = (e) => {
    const cleanEmail = e.target.value.replace(/\s+/g, '')
    setEmail(cleanEmail)
    setVerificationToken(null)
    setAlreadyMember(false)
    setPendingExists(false)
    setError('')
  }

  const handleEmailVerified = (token) => {
    setVerificationToken(token)
    setError('')
  }

  // Real-time Employee ID availability check on blur
  const handleEmployeeIdBlur = async () => {
    const cleanId = employeeId.trim().toUpperCase()
    if (!cleanId || !companySlug || cleanId === lastCheckedEmpIdRef.current) return

    try {
      setIsCheckingEmpId(true)
      setEmployeeIdError('')
      const checkPromise = checkEmployeeIdInCompanyApi({
        companySlug,
        employeeId: cleanId,
      })
      empCheckPromiseRef.current = checkPromise
      const res = await checkPromise
      lastCheckedEmpIdRef.current = cleanId

      if (res?.exists) {
        setEmployeeIdError(
          res.message || `Employee ID "${cleanId}" is already assigned to a member in this company.`
        )
      }
      return res
    } catch {
      // Don't block user on network blips during blur
    } finally {
      setIsCheckingEmpId(false)
      empCheckPromiseRef.current = null
    }
  }

  // Custom send OTP function: Verifies email is not already an active member before dispatching OTP
  const handleSendOtp = async (targetEmail, options = {}) => {
    setAlreadyMember(false)
    setPendingExists(false)
    setError('')

    try {
      return await sendAccessRequestOtpApi({ email: targetEmail, companySlug }, options)
    } catch (err) {
      if (err.data?.alreadyMember || err.message?.includes('already an active member')) {
        setAlreadyMember(true)
      } else if (err.data?.pendingExists || err.message?.includes('already have a pending')) {
        setPendingExists(true)
      }
      throw err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    const cleanId = employeeId.trim().toUpperCase()
    if (!cleanId) {
      setError('Please enter your Employee ID')
      return
    }
    if (employeeIdError) {
      setError('Please provide a unique Employee ID for this company')
      return
    }
    if (!isEmailVerified) {
      setError('Please verify your work email with OTP first')
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsSubmitting(true)
      setError('')

      // 1. If an employee ID blur check is running or pending, await it seamlessly
      if (empCheckPromiseRef.current) {
        const checkRes = await empCheckPromiseRef.current
        if (checkRes?.exists) {
          setEmployeeIdError(
            checkRes.message || `Employee ID "${cleanId}" is already assigned to a member in this company.`
          )
          setError('Please provide a unique Employee ID for this company')
          setIsSubmitting(false)
          return
        }
      } else if (cleanId !== lastCheckedEmpIdRef.current) {
        const checkRes = await checkEmployeeIdInCompanyApi(
          { companySlug, employeeId: cleanId },
          { signal: controller.signal }
        )
        lastCheckedEmpIdRef.current = cleanId
        if (checkRes?.exists) {
          setEmployeeIdError(
            checkRes.message || `Employee ID "${cleanId}" is already assigned to a member in this company.`
          )
          setError('Please provide a unique Employee ID for this company')
          setIsSubmitting(false)
          return
        }
      }

      await submitAccessRequestApi(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          employeeId: cleanId,
          companySlug,
          role,
          verificationToken,
        },
        { signal: controller.signal }
      )
      if (!controller.signal.aborted) {
        setIsSubmitted(true)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return
      }
      setError(err.message || 'Failed to submit access request.')
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false)
      }
    }
  }

  return {
    fullName,
    handleFullNameChange,
    email,
    handleEmailChange,
    employeeId,
    employeeIdError,
    handleEmployeeIdChange,
    handleEmployeeIdBlur,
    role,
    setRole,
    verificationToken,
    isEmailVerified,
    handleEmailVerified,
    handleSendOtp,
    isSubmitting,
    isCheckingEmpId,
    alreadyMember,
    pendingExists,
    error,
    isSubmitted,
    handleSubmit,
    handleModalClose,
  }
}

