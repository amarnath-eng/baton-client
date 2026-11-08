import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginApi } from '../../../services/authApi.js'
import { setCredentials } from '../../../store/authSlice.js'
import { ROUTES } from '../../../routes/paths.js'

/**
 * Single Responsibility: Manages state, validation, submission, and auth session
 * initialization for the user login flow.
 */
export function useLoginForm({ onSubmitSuccess } = {}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const abortControllerRef = useRef(null)

  // Clean up in-flight login request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleChange = (field) => (e) => {
    let val = e.target.value
    if (field === 'email') {
      val = val.replace(/\s+/g, '').toLowerCase()
    } else if (field === 'password') {
      val = val.replace(/^\s+/, '')
    }
    setFormData((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (errors.form) setErrors((prev) => ({ ...prev, form: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid work email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const data = await loginApi(
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
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
    errors,
    showPassword,
    setShowPassword,
    isSubmitting,
    handleChange,
    handleSubmit,
  }
}

