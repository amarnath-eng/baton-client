/**
 * Formats a user or applicant name/email into 2-letter uppercase initials
 * @param {string} name
 * @param {string} email
 * @returns {string}
 */
export function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return '??'
}

/**
 * Formats an ISO date string into readable short date (e.g., "Oct 25, 2026")
 * @param {string|Date} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Resolves the invitation URL from direct prop or local session storage fallback
 * @param {string} id
 * @param {string} directUrl
 * @returns {string|null}
 */
export function getInviteUrl(id, directUrl) {
  if (directUrl) return directUrl
  try {
    const saved = JSON.parse(localStorage.getItem('baton_invite_urls') || '{}')
    return saved[id] || null
  } catch (_) {
    return null
  }
}
