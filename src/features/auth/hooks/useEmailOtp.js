import { useState, useEffect } from 'react'
import { sendOtpApi, verifyOtpApi } from '../../../services/authApi.js'

/**
 * Headless Hook: Finite State Machine for Email OTP Verification
 * Statuses: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'locked'
 */
export function useEmailOtp(email, onVerified, initialToken = null) {
  const [status, setStatus] = useState(initialToken ? 'verified' : 'idle')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(initialToken ? 'Email verified successfully!' : '')
  const [cooldown, setCooldown] = useState(0)
  const [remainingResends, setRemainingResends] = useState(3)

  // Sync initialToken if provided or updated
  useEffect(() => {
    if (initialToken) {
      setStatus('verified')
      setSuccessMessage('Email verified successfully!')
    }
  }, [initialToken])

  // 60-second cooldown timer countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Reset verification state when email changes
  const reset = () => {
    setStatus('idle')
    setOtp('')
    setError('')
    setSuccessMessage('')
    setCooldown(0)
  }

  // Dispatch OTP
  const sendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid work email first')
      return
    }

    try {
      setStatus('sending')
      setError('')
      const data = await sendOtpApi(email)
      setStatus('sent')
      setCooldown(60)
      setRemainingResends(data?.remainingResends ?? 2)
      setSuccessMessage('Verification code sent to your email.')
    } catch (err) {
      setError(err.message)
      if (err.message.includes('Too many') || err.message.includes('Maximum')) {
        setStatus('locked')
      } else {
        setStatus('idle')
      }
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    try {
      setStatus('verifying')
      setError('')
      const data = await verifyOtpApi(email, otp)
      setStatus('verified')
      setSuccessMessage('Email verified successfully!')
      onVerified?.(data?.verificationToken)
    } catch (err) {
      setError(err.message)
      if (err.message.includes('Too many')) {
        setStatus('locked')
      } else {
        setStatus('sent')
      }
    }
  }

  return {
    status,
    otp,
    setOtp,
    error,
    successMessage,
    cooldown,
    remainingResends,
    sendOtp,
    verifyOtp,
    reset,
  }
}
