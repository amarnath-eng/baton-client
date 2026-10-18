import { request } from './apiClient.js'

export async function sendOtpApi(email) {
  return request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
    defaultError: 'Failed to send verification code.',
  })
}

export async function verifyOtpApi(email, otp) {
  return request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
    defaultError: 'Failed to verify OTP code.',
  })
}

export async function registerApi(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Registration failed.',
  })
}

export async function loginApi(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Login failed.',
  })
}

export async function getMeApi() {
  return request('/auth/me', {
    defaultError: 'Failed to retrieve session.',
  })
}

export async function logoutApi() {
  return request('/auth/logout', {
    method: 'POST',
    defaultError: 'Logout failed.',
  })
}
