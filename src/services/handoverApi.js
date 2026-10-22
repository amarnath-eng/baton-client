import { request } from './apiClient.js'

/**
 * 1. Fetch handovers for current user's workspace
 * @param {{ status?: string, project?: string }} [params]
 */
export async function getHandoversApi(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.project) query.set('project', params.project)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  const data = await request(`/handovers${queryString}`, {
    defaultError: 'Failed to fetch handovers.',
  })
  return data?.handovers ?? []
}

/**
 * 2. Get single handover by ID
 * @param {string} id
 */
export async function getHandoverByIdApi(id) {
  const data = await request(`/handovers/${id}`, {
    defaultError: 'Failed to fetch handover details.',
  })
  return data?.handover ?? null
}

/**
 * 3. Create a new handover (Admin or Manager)
 * @param {{ title: string, project: string, reason: string, deadline: string, outgoingEngineerId: string, incomingEngineerId: string }} payload
 */
export async function createHandoverApi(payload) {
  return request('/handovers', {
    method: 'POST',
    body: JSON.stringify(payload),
    defaultError: 'Failed to create handover.',
  })
}
