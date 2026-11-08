import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerApi } from '../../../services/authApi.js'
import { setCredentials } from '../../../store/authSlice.js'
import { ROUTES } from '../../../routes/paths.js'

export function useRegister({ onSubmitSuccess } = {}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(null)

  // Clean up in-flight register request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    companyName: '',
    workspaceSlug: '',
    password: '',
    confirmPassword: '',
  })

  const [verificationToken, setVerificationToken] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slugStatus, setSlugStatus] = useState({
    isChecking: false,
    exists: false,
    companyName: '',
  })
  const [isRequestAccessOpen, setIsRequestAccessOpen] = useState(false)

  const isEmailVerified = Boolean(verificationToken)

  const handleFullNameChange = (e) => {
    const val = e.target.value
      .replace(/^\s+/, '')
      .replace(/[^a-zA-Z\s.'-]/g, '')
      .replace(/\s{2,}/g, ' ')

    setFormData((prev) => ({ ...prev, fullName: val }))
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
  }

  const handleEmployeeIdChange = (e) => {
    const val = e.target.value.replace(/^\s+/, '').toUpperCase()
    setFormData((prev) => ({ ...prev, employeeId: val }))
    if (errors.employeeId) setErrors((prev) => ({ ...prev, employeeId: '' }))
  }

  const handleEmailChange = (e) => {
    const cleanEmail = e.target.value.replace(/\s+/g, '').toLowerCase()
    setFormData((prev) => ({ ...prev, email: cleanEmail }))
    setVerificationToken(null)
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
  }

  const handleCompanyChange = (companyName, workspaceSlug) => {
    setFormData((prev) => ({
      ...prev,
      companyName,
      workspaceSlug,
    }))
    if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }))
    if (errors.workspaceSlug) setErrors((prev) => ({ ...prev, workspaceSlug: '' }))
  }

  const handleSlugChange = (workspaceSlug) => {
    setFormData((prev) => ({ ...prev, workspaceSlug }))
    if (errors.workspaceSlug) setErrors((prev) => ({ ...prev, workspaceSlug: '' }))
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setFormData((prev) => ({ ...prev, password: val }))
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
  }

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setFormData((prev) => ({ ...prev, confirmPassword: val }))
    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    const cleanPassword = formData.password.trim()
    const cleanConfirm = formData.confirmPassword.trim()

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required'
    if (!formData.email.trim()) newErrors.email = 'Work email is required'
    else if (!isEmailVerified) newErrors.email = 'Please verify your work email with OTP first'

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.workspaceSlug.trim()) newErrors.workspaceSlug = 'Workspace slug is required'
    else if (slugStatus.exists) {
      newErrors.workspaceSlug = `Workspace "${formData.workspaceSlug}" is taken. Choose another URL or click Request Access.`
    }

    if (!cleanPassword) newErrors.password = 'Password is required'
    else if (cleanPassword.length < 8) newErrors.password = 'Password must be at least 8 characters'

    if (cleanPassword !== cleanConfirm) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsSubmitting(true)
      const data = await registerApi(
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          employeeId: formData.employeeId.trim().toUpperCase(),
          companyName: formData.companyName.trim(),
          workspaceSlug: formData.workspaceSlug.trim(),
          password: formData.password.trim(),
          verificationToken,
        },
        { signal: controller.signal }
      )

      if (!controller.signal.aborted) {
        dispatch(setCredentials(data))

        if (onSubmitSuccess) {
          onSubmitSuccess(data)
        } else {
          navigate(ROUTES.DASHBOARD)
        }
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setErrors((prev) => ({ ...prev, form: err.message }))
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false)
      }
    }
  }

  return {
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
    handleEmployeeIdChange,
    handleEmailChange,
    handleCompanyChange,
    handleSlugChange,
    handleSlugStatusChange: setSlugStatus,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  }
}
