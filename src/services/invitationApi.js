import { request } from './apiClient.js'

/**
 * 1. Verify invitation token
 * @param {string} token
 */
export async function verifyInviteTokenApi(token) {
  return request(`/invitations/verify/${encodeURIComponent(token)}`, {
    defaultError: 'Invalid or expired invitation link.',
  })
}

/**
 * 2. Accept invitation and join workspace
 * @param {{ token: string, fullName?: string, password?: string }} payload
 */
export async function acceptInviteApi(payload) {
  return request('/invitations/accept', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to accept invitation.',
  })
}

/**
 * 3. Send team invitation (Admin or Manager)
 * @param {{ name: string, email: string, role: string, message?: string }} payload
 */
export async function createInvitationApi(payload) {
  return request('/invitations', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to send invitation.',
  })
}

/**
 * 4. Get all invitations for the workspace
 */
export async function getInvitationsApi() {
  const data = await request('/invitations', {
    defaultError: 'Failed to fetch invitations.',
  })
  return data?.invitations ?? []
}

/**
 * 5. Revoke a pending invitation
 * @param {string} id
 */
export async function revokeInvitationApi(id) {
  return request(`/invitations/${id}/revoke`, {
    method: 'POST',
    defaultError: 'Failed to revoke invitation.',
  })
}
