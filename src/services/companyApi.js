import { request } from './apiClient.js'

/**
 * Checks whether a workspace slug already exists
 * @param {string} slug 
 * @returns {Promise<{ exists: boolean, slug: string, companyName?: string }>}
 */
export async function checkSlugApi(slug, options = {}) {
  if (!slug || !slug.trim()) {
    return { exists: false, slug: '' }
  }

  return request(`/companies/check-slug/${encodeURIComponent(slug.trim())}`, {
    defaultError: 'Failed to check workspace slug.',
    ...options,
  })
}

export async function getCompanyMembersApi(options = {}) {
  const data = await request('/companies/members', {
    defaultError: 'Failed to fetch workspace members.',
    ...options,
  })
  return data?.members ?? []
}

