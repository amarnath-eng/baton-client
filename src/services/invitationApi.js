import { request } from './apiClient.js'

/**
 * 1. Verify invitation token
 * @param {string} token
 */
export async function verifyInviteTokenApi(token, options = {}) {
  return request(`/invitations/verify/${encodeURIComponent(token)}`, {
    defaultError: 'Invalid or expired invitation link.',
    ...options,
  })
}

/**
 * 2. Accept invitation and join workspace
 * @param {{ token: string, fullName?: string, password?: string }} payload
 */
export async function acceptInviteApi(payload, options = {}) {
  return request('/invitations/accept', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to accept invitation.',
    ...options,
  })
}

/**
 * 3. Send team invitation (Admin or Manager)
 * @param {{ name: string, email: string, role: string, message?: string }} payload
 */
export async function createInvitationApi(payload, options = {}) {
  return request('/invitations', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to send invitation.',
    ...options,
  })
}

/**
 * 4. Get all invitations for the workspace
 */
export async function getInvitationsApi(options = {}) {
  const data = await request('/invitations', {
    defaultError: 'Failed to fetch invitations.',
    ...options,
  })
  return data?.invitations ?? []
}

/**
 * 5. Revoke a pending invitation
 * @param {string} id
 */
export async function revokeInvitationApi(id, options = {}) {
  return request(`/invitations/${id}/revoke`, {
    method: 'POST',
    defaultError: 'Failed to revoke invitation.',
    ...options,
  })
}
