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

/**
 * Checks real-time availability for both company name and workspace slug
 * @param {{ name?: string, slug?: string }} params
 * @param {object} options
 * @returns {Promise<{
 *   name: { exists: boolean, companyName: string|null, slug: string|null },
 *   slug: { exists: boolean, companyName: string|null, slug: string|null }
 * }>}
 */
export async function checkWorkspaceApi({ name = '', slug = '' } = {}, options = {}) {
  const queryParams = new URLSearchParams()
  if (name && name.trim()) queryParams.set('name', name.trim())
  if (slug && slug.trim()) queryParams.set('slug', slug.trim())

  return request(`/companies/check-workspace?${queryParams.toString()}`, {
    defaultError: 'Failed to check workspace availability.',
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

