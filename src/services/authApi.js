const API_BASE = 'http://localhost:5000/api/auth'

/**
 * Centralized HTTP request helper
 * Automatically includes credentials (cookies) on all requests
 */
async function request(endpoint, { headers, ...options } = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  const json = await res.json()

  if (!res.ok || !json?.success) throw new Error(json?.message || 'Something went wrong')

  return json?.data ?? {}
}

export async function sendOtpApi(email) {
  return request('/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function verifyOtpApi(email, otp) {
  return request('/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export async function registerApi(payload) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginApi(payload) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getMeApi() {
  return request('/me')
}

export async function logoutApi() {
  return request('/logout', {
    method: 'POST',
  })
}
