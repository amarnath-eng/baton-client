export const INVITATION_STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
})

export const INVITATION_STATUSES = Object.freeze(Object.values(INVITATION_STATUS))
