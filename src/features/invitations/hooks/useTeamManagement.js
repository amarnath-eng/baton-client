import { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getAccessRequestsApi, reviewAccessRequestApi } from '../../../services/accessRequestApi.js'
import { getInvitationsApi, revokeInvitationApi } from '../../../services/invitationApi.js'
import { useWindowFocus } from '../../../hooks/useWindowFocus.js'
import { USER_ROLES } from '../../../constants/roles.js'

export function useTeamManagement(activeTab = 'requests') {
  const { role: currentUserRole } = useSelector((state) => state.auth)
  const isAdmin = currentUserRole === USER_ROLES.ADMIN
  const canInvite = currentUserRole === USER_ROLES.ADMIN || currentUserRole === USER_ROLES.MANAGER

  const [requests, setRequests] = useState([])
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [approvedInviteData, setApprovedInviteData] = useState(null)

  const abortControllerRef = useRef(null)
  const actionAbortControllerRef = useRef(null)
  const successTimeoutRef = useRef(null)

  const fetchData = useCallback(async () => {
    // 1. Terminate previous in-flight request if user quickly switched tabs
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'requests') {
        if (isAdmin) {
          const reqData = await getAccessRequestsApi({ signal: controller.signal })
          if (!controller.signal.aborted) {
            setRequests(reqData || [])
          }
        }
      } else if (activeTab === 'invitations') {
        const invData = await getInvitationsApi({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setInvitations(invData || [])
        }
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return
      }
      setError(err?.message || 'Failed to load team data.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [activeTab, isAdmin])

  useEffect(() => {
    fetchData()
    return () => {
      // Clean up in-flight requests on unmount to prevent React memory leaks
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (actionAbortControllerRef.current) {
        actionAbortControllerRef.current.abort()
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [fetchData])

  // Revalidate fresh team data when returning to browser window
  useWindowFocus(fetchData)

  async function handleReviewRequest(id, action, requestedRole, reviewNotes = '', applicantInfo = null) {
    if (actionAbortControllerRef.current) {
      actionAbortControllerRef.current.abort()
    }
    const controller = new AbortController()
    actionAbortControllerRef.current = controller

    setActionLoadingId(id)
    setError(null)
    setNotification(null)
    try {
      const response = await reviewAccessRequestApi(
        id,
        {
          action,
          assignedRole: requestedRole,
          reviewNotes: reviewNotes?.trim() || '',
        },
        { signal: controller.signal }
      )

      if (action === 'approve') {
        if (response?.inviteUrl) {
          console.log('[Baton Approved Access Request Link]:', response.inviteUrl)
          try {
            const saved = JSON.parse(localStorage.getItem('baton_invite_urls') || '{}')
            saved[id] = response.inviteUrl
            if (response.invitationId) saved[response.invitationId] = response.inviteUrl
            localStorage.setItem('baton_invite_urls', JSON.stringify(saved))
          } catch (_) {}
        }
        setNotification({ type: 'approve', message: 'Access request approved. Invitation email sent.' })
      } else if (action === 'reject') {
        setNotification({ type: 'reject', message: 'Access request has been rejected.' })
      }

      await fetchData()
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err?.message || `Failed to ${action} access request.`)
    } finally {
      if (!controller.signal.aborted) {
        setActionLoadingId(null)
      }
    }
  }

  async function handleRevokeInvitation(id) {
    if (actionAbortControllerRef.current) {
      actionAbortControllerRef.current.abort()
    }
    const controller = new AbortController()
    actionAbortControllerRef.current = controller

    setActionLoadingId(id)
    setError(null)
    setNotification(null)
    try {
      await revokeInvitationApi(id, { signal: controller.signal })
      setNotification({ type: 'reject', message: 'Invitation revoked successfully.' })
      await fetchData()
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err?.message || 'Failed to revoke invitation.')
    } finally {
      if (!controller.signal.aborted) {
        setActionLoadingId(null)
      }
    }
  }

  return {
    isAdmin,
    canInvite,
    requests,
    invitations,
    loading,
    actionLoadingId,
    error,
    setError,
    notification,
    setNotification,
    successMessage: notification?.message,
    setSuccessMessage: (msg) => setNotification(msg ? { type: 'approve', message: msg } : null),
    approvedInviteData,
    setApprovedInviteData,
    handleReviewRequest,
    handleRevokeInvitation,
    refetch: fetchData,
  }
}
