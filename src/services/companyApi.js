const API_BASE = 'http://localhost:5000/api/companies'

/**
 * Checks whether a workspace slug already exists
 * @param {string} slug 
 * @returns {Promise<{ exists: boolean, slug: string, companyName?: string }>}
 */
export async function checkSlugApi(slug) {
  if (!slug || !slug.trim()) {
    return { exists: false, slug: '' }
  }

  const res = await fetch(`${API_BASE}/check-slug/${encodeURIComponent(slug.trim())}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || 'Failed to check workspace slug')
  }

  return json?.data ?? {}
}
