import { request } from './apiClient.js'

/**
 * 1. Submit an access request to join an existing company workspace
 * @param {{ fullName: string, email: string, companySlug: string, role: string, verificationToken: string }} payload
 */
export async function submitAccessRequestApi(payload) {
  return request('/access-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to submit access request.',
  })
}

/**
 * 2. Get all access requests for the workspace (Admin)
 */
export async function getAccessRequestsApi() {
  const data = await request('/access-requests', {
    defaultError: 'Failed to fetch access requests.',
  })
  return data?.requests ?? []
}

/**
 * 3. Review an access request (Admin)
 * @param {string} id
 * @param {{ action: 'approve' | 'reject', assignedRole?: string, reviewNotes?: string }} payload
 */
export async function reviewAccessRequestApi(id, payload) {
  return request(`/access-requests/${id}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to review access request.',
  })
}
