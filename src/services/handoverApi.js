import { request } from './apiClient.js'

/**
 * 1. Fetch handovers for current user's workspace
 * @param {{ status?: string, project?: string }} [params]
 */
export async function getHandoversApi(params = {}, options = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.project) query.set('project', params.project)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  const data = await request(`/handovers${queryString}`, {
    defaultError: 'Failed to fetch handovers.',
    ...options,
  })
  return data?.handovers ?? []
}

/**
 * 2. Get single handover by ID
 * @param {string} id
 * @param {RequestInit} [options]
 */
export async function getHandoverByIdApi(id, options = {}) {
  const data = await request(`/handovers/${id}`, {
    defaultError: 'Failed to fetch handover details.',
    ...options,
  })
  return data?.handover ?? null
}

/**
 * 3. Create a new handover (Admin or Manager)
 * @param {{ title: string, project: string, reason: string, deadline: string, outgoingEngineerId: string, incomingEngineerId: string }} payload
 */
export async function createHandoverApi(payload, options = {}) {
  return request('/handovers', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to create handover.',
    ...options,
  })
}

/**
 * 4. Update a single section of a handover (Autosave or Manual)
 * @param {string} id
 * @param {{ sectionKey: string, content: string, isComplete: boolean }} payload
 */
export async function updateHandoverSectionApi(id, payload, options = {}) {
  return request(`/handovers/${id}/section`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    defaultError: 'Failed to update section content.',
    ...options,
  })
}

/**
 * 5. Submit handover for review (Requires all 6 sections to be complete)
 * @param {string} id
 */
export async function submitHandoverForReviewApi(id, options = {}) {
  return request(`/handovers/${id}/submit`, {
    method: 'POST',
    defaultError: 'Failed to submit handover for review.',
    ...options,
  })
}

/**
 * 6. Review handover: Approve or Request Revision (Manager/Admin)
 * @param {string} id
 * @param {{ action: 'approve' | 'request_revision', reviewNotes?: string }} payload
 */
export async function reviewHandoverApi(id, payload, options = {}) {
  return request(`/handovers/${id}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to submit review decision.',
    ...options,
  })
}

/**
 * 7. Acknowledge handover: Final sign-off by incoming engineer
 * @param {string} id
 */
export async function acknowledgeHandoverApi(id, options = {}) {
  return request(`/handovers/${id}/acknowledge`, {
    method: 'POST',
    defaultError: 'Failed to acknowledge handover.',
    ...options,
  })
}

