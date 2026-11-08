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
 * Computes remaining active time until invitation expiry and formats into single unit:
 * - >= 1 day: 'Xd left' (e.g., '1d left', '6d left')
 * - < 1 day, >= 1 hour: 'Xh left' (e.g., '23h left', '1h left')
 * - < 1 hour, >= 1 min: 'Xm left' (e.g., '45m left', '1m left')
 * - < 1 min, > 0 sec: 'Xs left' (e.g., '59s left', '1s left')
 * - <= 0: 'Expired'
 *
 * @param {string|Date} expiresAt
 * @param {number} [now=Date.now()]
 * @returns {{ text: string, isExpired: boolean, isUrgent: boolean, unit: 'd'|'h'|'m'|'s'|'expired' }}
 */
export function getActiveTimeRemaining(expiresAt, now = Date.now()) {
  if (!expiresAt) return { text: '—', isExpired: false, isUrgent: false, unit: 'expired' }

  const target = new Date(expiresAt).getTime()
  const diffMs = target - now

  if (diffMs <= 0) {
    return { text: 'Expired', isExpired: true, isUrgent: false, unit: 'expired' }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds / 60)

  if (days >= 1) {
    return { text: `${days}d left`, isExpired: false, isUrgent: false, unit: 'd' }
  }
  if (hours >= 1) {
    return { text: `${hours}h left`, isExpired: false, isUrgent: hours <= 2, unit: 'h' }
  }
  if (minutes >= 1) {
    return { text: `${minutes}m left`, isExpired: false, isUrgent: true, unit: 'm' }
  }
  const seconds = Math.max(1, totalSeconds)
  return { text: `${seconds}s left`, isExpired: false, isUrgent: true, unit: 's' }
}

export function formatActiveTime(expiresAt, now = Date.now()) {
  return getActiveTimeRemaining(expiresAt, now).text
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
