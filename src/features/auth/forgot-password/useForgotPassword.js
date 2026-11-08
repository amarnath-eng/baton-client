import { useState, useRef, useEffect } from 'react'
import { resetPasswordApi } from '../../../services/authApi.js'

/**
 * Single Responsibility: Manages state, password validations, and submission
 * lifecycle for resetting a user account password.
 */
export function useForgotPassword() {
  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const abortControllerRef = useRef(null)

  // Clean up in-flight reset request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Smart password input: block leading spaces, allow Diceware multi-word passphrases
  const handlePasswordKeyDown = (e) => {
    if (e.key === ' ' && !password) {
      e.preventDefault()
    }
  }

  const handleConfirmPasswordKeyDown = (e) => {
    if (e.key === ' ' && !confirmPassword) {
      e.preventDefault()
    }
  }

  const handlePasswordInput = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setPassword(val)
    if (error) setError('')
  }

  const handleConfirmPasswordInput = (e) => {
    const val = e.target.value.replace(/^\s+/, '')
    setConfirmPassword(val)
    if (error) setError('')
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value.replace(/\s+/g, ''))
    setVerificationToken(null)
    setError('')
  }

  const handleEmailVerified = (token) => {
    setVerificationToken(token)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!verificationToken) {
      setError('Please verify your work email with the OTP code first.')
      return
    }

    const cleanPassword = password.trim()
    const cleanConfirm = confirmPassword.trim()

    if (!cleanPassword || cleanPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      return
    }

    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match. Please re-enter your new password.')
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
      await resetPasswordApi(
        {
          email: email.trim(),
          password: cleanPassword,
          verificationToken,
        },
        { signal: controller.signal }
      )
      if (!controller.signal.aborted) {
        setIsSuccess(true)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false)
      }
    }
  }

  return {
    email,
    handleEmailChange,
    verificationToken,
    handleEmailVerified,
    password,
    handlePasswordInput,
    handlePasswordKeyDown,
    confirmPassword,
    handleConfirmPasswordInput,
    handleConfirmPasswordKeyDown,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    error,
    isSuccess,
    handleSubmit,
  }
}

