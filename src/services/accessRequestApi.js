import { request } from './apiClient.js'

/**
 * 0a. Check Employee ID availability within a specific company
 * @param {{ companySlug: string, employeeId: string }} params
 */
export async function checkEmployeeIdInCompanyApi({ companySlug, employeeId }, options = {}) {
  const query = new URLSearchParams({
    companySlug: companySlug.trim(),
    employeeId: employeeId.trim(),
  })
  return request(`/access-requests/check-employee-id?${query.toString()}`, {
    defaultError: 'Failed to check Employee ID availability.',
    ...options,
  })
}

/**
 * 0b. Send OTP specifically for access request (verifies email is not already an active member of the company)
 * @param {{ email: string, companySlug: string }} payload
 */
export async function sendAccessRequestOtpApi({ email, companySlug }, options = {}) {
  return request('/access-requests/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email, companySlug }),
    defaultError: 'Failed to send verification code.',
    ...options,
  })
}

/**
 * 1. Submit an access request to join an existing company workspace
 * @param {{ fullName: string, email: string, companySlug: string, role: string, verificationToken: string }} payload
 */
export async function submitAccessRequestApi(payload, options = {}) {
  return request('/access-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to submit access request.',
    ...options,
  })
}

/**
 * 2. Get all access requests for the workspace (Admin)
 */
export async function getAccessRequestsApi(options = {}) {
  const data = await request('/access-requests', {
    defaultError: 'Failed to fetch access requests.',
    ...options,
  })
  return data?.requests ?? []
}

/**
 * 3. Review an access request (Admin)
 * @param {string} id
 * @param {{ action: 'approve' | 'reject', assignedRole?: string, reviewNotes?: string }} payload
 */
export async function reviewAccessRequestApi(id, payload, options = {}) {
  return request(`/access-requests/${id}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to review access request.',
    ...options,
  })
}
