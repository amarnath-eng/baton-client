import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuthSession } from '../../../store/authSlice.js'
import { verifyInviteTokenApi, acceptInviteApi } from '../../../services/invitationApi.js'
import { useDeferredLoading } from '../../../hooks/useDeferredLoading.js'
import { ROUTES } from '../../../routes/paths.js'

/**
 * Single Responsibility: Manages token verification, acceptance form state,
 * submission lifecycle, and auth session hydration for member invitation acceptance.
 */
export function useAcceptInvite() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const showSkeleton = useDeferredLoading(loading, { delayMs: 150, minDurationMs: 300 })
  const [inviteData, setInviteData] = useState(null)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
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
          setEmployeeId(data.employeeId || '')
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

    if (!employeeId.trim()) {
      setSubmitError('Please enter your Employee ID.')
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
          employeeId: employeeId.trim().toUpperCase(),
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

  return {
    token,
    loading,
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
  }
}

