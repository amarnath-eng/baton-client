import { request } from './apiClient.js'

export async function sendOtpApi(email, options = {}) {
  return request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
    defaultError: 'Failed to send verification code.',
    ...options,
  })
}

export async function verifyOtpApi(email, otp, options = {}) {
  return request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
    defaultError: 'Failed to verify OTP code.',
    ...options,
  })
}

export async function registerApi(payload, options = {}) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Registration failed.',
    ...options,
  })
}

export async function loginApi(payload, options = {}) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Login failed.',
    ...options,
  })
}

export async function getMeApi(options = {}) {
  return request('/auth/me', {
    defaultError: 'Failed to retrieve session.',
    ...options,
  })
}

export async function logoutApi(options = {}) {
  return request('/auth/logout', {
    method: 'POST',
    defaultError: 'Logout failed.',
    ...options,
  })
}

export async function sendPasswordResetOtpApi(email, options = {}) {
  return request('/auth/forgot-password/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
    defaultError: 'Failed to send password reset code.',
    ...options,
  })
}

export async function resetPasswordApi(payload, options = {}) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to reset password.',
    ...options,
  })
}

