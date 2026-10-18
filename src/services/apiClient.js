const API_BASE = 'http://localhost:5000/api'

export async function request(endpoint, { headers, defaultError = 'Something went wrong', ...options } = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  const json = await res.json()

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || defaultError)
  }

  return json?.data ?? {}
}
