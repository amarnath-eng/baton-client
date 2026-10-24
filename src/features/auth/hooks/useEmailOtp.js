import { useState, useEffect, useRef } from 'react'
import { sendOtpApi, verifyOtpApi } from '../../../services/authApi.js'

export function formatCooldownTime(seconds) {
  if (seconds <= 0) return ''
  if (seconds <= 60) {
    return `${seconds}s`
  }
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (s === 0) {
    return `${m}m`
  }
  return `${m}m ${s < 10 ? '0' : ''}${s}s`
}

/**
 * Headless Hook: Finite State Machine for Email OTP Verification
 * Statuses: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'locked'
 */
export function useEmailOtp(email, onVerified, initialToken = null, customSendFn = null) {
  const [status, setStatus] = useState(initialToken ? 'verified' : 'idle')
  const [otp, setOtp] = useState('')
  const [lastFailedOtp, setLastFailedOtp] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(initialToken ? 'Email verified successfully!' : '')
  const [cooldown, setCooldown] = useState(0)
  const [remainingResends, setRemainingResends] = useState(3)
  const [isResending, setIsResending] = useState(false)
  const prevCooldownRef = useRef(0)

  // Sync initialToken if provided or updated
  useEffect(() => {
    if (initialToken) {
      setStatus('verified')
      setSuccessMessage('Email verified successfully!')
    }
  }, [initialToken])

  // Cooldown countdown timer with auto-clear only when a timer naturally expires
  useEffect(() => {
    if (cooldown <= 0) {
      if (prevCooldownRef.current > 0) {
        if (error && (error.includes('before requesting a new code') || error.includes('limit reached') || error.includes('Too many'))) {
          setError('')
        }
        if (status === 'locked') {
          setStatus('sent')
          setRemainingResends(3)
        }
      }
      prevCooldownRef.current = 0
      return
    }

    prevCooldownRef.current = cooldown
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown, error, status])

  // Handle OTP change: clear error if user edits digits while not locked
  const handleOtpChange = (newOtp) => {
    setOtp(newOtp)
    if (status !== 'locked' && lastFailedOtp && newOtp !== lastFailedOtp) {
      setError('')
    }
  }

  // Reset verification state when email changes
  const reset = () => {
    setStatus('idle')
    setOtp('')
    setLastFailedOtp('')
    setError('')
    setSuccessMessage('')
    setCooldown(0)
    setIsResending(false)
  }

  // Dispatch OTP
  const sendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid work email first')
      return false
    }

    const isFirstSend = status === 'idle'
    if (isFirstSend) {
      setStatus('sending')
    } else {
      setIsResending(true)
    }
    setError('')
    // Clear OTP inputs immediately when dispatching / resending code
    setOtp('')

    try {
      const dispatchFn = typeof customSendFn === 'function' ? customSendFn : sendOtpApi
      const data = await dispatchFn(email)
      const remaining = typeof data?.remainingResends === 'number' ? data.remainingResends : 2
      const secs = typeof data?.remainingSeconds === 'number' ? data.remainingSeconds : (remaining === 0 ? 600 : 60)
      setRemainingResends(remaining)
      setCooldown(secs)
      setStatus('sent')
      setIsResending(false)
      setSuccessMessage('Verification code sent to your email.')
      // Reset failed attempt tracking on successful code dispatch
      setLastFailedOtp('')
      return true
    } catch (err) {
      setIsResending(false)
      const errPayload = err.errors || err.data || {}
      if (typeof errPayload.remainingResends === 'number') {
        setRemainingResends(errPayload.remainingResends)
      }

      const waitMatch = err.message?.match(/Please wait (\d+)s/i)
      const secs =
        errPayload.remainingSeconds ||
        (errPayload.minutesRemaining ? errPayload.minutesRemaining * 60 : 0) ||
        (waitMatch ? parseInt(waitMatch[1], 10) : 0)

      if (secs > 0) {
        setCooldown(secs)
      }

      const isAttemptLockout =
        errPayload.locked ||
        err.message?.includes('Too many failed') ||
        err.message?.includes('Too many incorrect')

      const isResendRateLimit =
        !isAttemptLockout &&
        (err.message?.includes('limit reached') ||
         err.message?.includes('before requesting') ||
         err.message?.includes('Maximum'))

      if (isAttemptLockout) {
        setStatus('locked')
        setRemainingResends(0)
        setError(err.message)
      } else if (isResendRateLimit) {
        setError('')
        setStatus(status === 'idle' ? 'idle' : 'sent')
      } else {
        setError(err.message)
        setStatus(status === 'idle' ? 'idle' : 'sent')
      }
      return false
    }
  }

  // Verify OTP
  const verifyOtp = async (overrideOtp) => {
    const code = (typeof overrideOtp === 'string' ? overrideOtp : otp).trim()
    if (code.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    try {
      setStatus('verifying')
      setError('')
      const data = await verifyOtpApi(email, code)
      setStatus('verified')
      setLastFailedOtp('')
      setSuccessMessage('Email verified successfully!')
      onVerified?.(data?.verificationToken)
    } catch (err) {
      setLastFailedOtp(code)
      setError(err.message)
      const errPayload = err.errors || err.data || {}
      if (errPayload.locked || err.message?.includes('Too many')) {
        setStatus('locked')
        setRemainingResends(0)
        const secs =
          errPayload.remainingSeconds ||
          (errPayload.minutesRemaining ? errPayload.minutesRemaining * 60 : 0) ||
          600
        if (secs > 0) {
          setCooldown(secs)
        }
      } else {
        setStatus('sent')
      }
    }
  }

  const displayError = (() => {
    if (
      !error ||
      error.includes('before requesting a new code') ||
      error.includes('Maximum OTP resend limit reached')
    ) {
      return ''
    }
    if (cooldown > 0 && (error.includes('Too many failed') || error.includes('Too many incorrect'))) {
      return `Too many failed attempts. Please try again in ${formatCooldownTime(cooldown)}.`
    }
    return error
  })()

  const isVerifyDisabled =
    otp.length !== 6 ||
    status === 'verifying' ||
    status === 'locked' ||
    (Boolean(lastFailedOtp) && otp === lastFailedOtp)

  return {
    status,
    isResending,
    otp,
    setOtp: handleOtpChange,
    lastFailedOtp,
    isVerifyDisabled,
    error: displayError,
    successMessage,
    cooldown,
    formattedCooldown: formatCooldownTime(cooldown),
    remainingResends,
    sendOtp,
    verifyOtp,
    reset,
  }
}
