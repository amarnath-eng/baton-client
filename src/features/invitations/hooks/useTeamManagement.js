import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getAccessRequestsApi, reviewAccessRequestApi } from '../../../services/accessRequestApi.js'
import { getInvitationsApi, revokeInvitationApi } from '../../../services/invitationApi.js'

export function useTeamManagement(onPendingRequestsChange) {
  const { role: currentUserRole } = useSelector((state) => state.auth)
  const isAdmin = currentUserRole === 'admin'
  const canInvite = currentUserRole === 'admin' || currentUserRole === 'manager'

  const [requests, setRequests] = useState([])
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [approvedInviteUrl, setApprovedInviteUrl] = useState(null)

  const isFetchingRef = useRef(false)

  // Memoized count of pending requests (only recomputes when requests array changes)
  const pendingRequestsCount = useMemo(
    () => requests.filter((r) => r.status === 'pending').length,
    [requests]
  )

  // Keep parent (e.g. Dashboard navigation badge) in sync
  useEffect(() => {
    onPendingRequestsChange?.(pendingRequestsCount)
  }, [pendingRequestsCount, onPendingRequestsChange])

  const fetchData = useCallback(async () => {
    // Prevent duplicate in-flight requests from button spamming
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    setLoading(true)
    setError(null)
    try {
      const [reqResult, invResult] = await Promise.allSettled([
        isAdmin ? getAccessRequestsApi() : Promise.resolve([]),
        getInvitationsApi(),
      ])

      if (reqResult.status === 'fulfilled') {
        setRequests(reqResult.value || [])
      }

      if (invResult.status === 'fulfilled') {
        setInvitations(invResult.value || [])
      }

      // If either failed, show the actual error message
      if (reqResult.status === 'rejected' || invResult.status === 'rejected') {
        const realError =
          invResult.reason?.message ||
          reqResult.reason?.message ||
          'Failed to load team data. Please check your connection.'
        setError(realError)
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch team data.')
    } finally {
      isFetchingRef.current = false
      setLoading(false)
    }
  }, [isAdmin, onPendingRequestsChange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleReviewRequest(id, action, requestedRole, reviewNotes = '') {
    setActionLoadingId(id)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await reviewAccessRequestApi(id, {
        action,
        assignedRole: requestedRole,
        reviewNotes: reviewNotes?.trim() || '',
      })

      if (action === 'approve' && response?.inviteUrl) {
        setApprovedInviteUrl(response.inviteUrl)
      }

      setSuccessMessage(
        action === 'approve'
          ? 'Access request approved! 7-day invitation link generated.'
          : 'Access request has been rejected.'
      )
      await fetchData()
    } catch (err) {
      setError(err?.message || `Failed to ${action} access request.`)
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleRevokeInvitation(id) {
    setActionLoadingId(id)
    setError(null)
    setSuccessMessage(null)
    try {
      await revokeInvitationApi(id)
      setSuccessMessage('Invitation revoked successfully.')
      await fetchData()
    } catch (err) {
      setError(err?.message || 'Failed to revoke invitation.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return {
    isAdmin,
    canInvite,
    requests,
    invitations,
    pendingRequestsCount,
    loading,
    actionLoadingId,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    approvedInviteUrl,
    setApprovedInviteUrl,
    handleReviewRequest,
    handleRevokeInvitation,
    refetch: fetchData,
  }
}
