import { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  getHandoverByIdApi,
  updateHandoverSectionApi,
  submitHandoverForReviewApi,
  reviewHandoverApi,
  acknowledgeHandoverApi,
} from '../../../services/handoverApi.js'
import { HANDOVER_SECTIONS, HANDOVER_STATUS } from '../../../constants/handover.js'
import { USER_ROLES } from '../../../constants/roles.js'
import { useWindowFocus } from '../../../hooks/useWindowFocus.js'

export function useHandoverDetail(handoverId) {
  const { user, role } = useSelector((state) => state.auth)

  const [handover, setHandover] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Active section key being viewed/edited (defaults to first section)
  const [activeSectionKey, setActiveSectionKey] = useState(HANDOVER_SECTIONS[0]?.key || 'completedWork')

  // Local draft content and completion for current section
  const [draftContent, setDraftContent] = useState('')
  const [isSectionComplete, setIsSectionComplete] = useState(false)

  // Saving states & feedback
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const abortControllerRef = useRef(null)

  // 1. Fetch single handover details
  const fetchHandover = useCallback(async () => {
    if (!handoverId) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const data = await getHandoverByIdApi(handoverId, { signal: controller.signal })
      if (!controller.signal.aborted && data) {
        setHandover(data)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err?.message || 'Failed to fetch handover details.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [handoverId])

  useEffect(() => {
    fetchHandover()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchHandover])

  useWindowFocus(fetchHandover)

  // 2. Synchronize draft state when activeSectionKey changes or handover is loaded
  useEffect(() => {
    if (!handover) return
    const currentSection = handover.sections?.[activeSectionKey]
    setDraftContent(currentSection?.content || '')
    setIsSectionComplete(Boolean(currentSection?.isComplete))
    setSaveSuccessMessage(null)
  }, [activeSectionKey, handover])

  // 3. Compute Granular RBAC Permissions
  const userId = user?._id || user?.id
  const isOutgoing = Boolean(
    handover?.outgoingEngineerId?._id === userId ||
    handover?.outgoingEngineerId === userId
  )
  const isIncoming = Boolean(
    handover?.incomingEngineerId?._id === userId ||
    handover?.incomingEngineerId === userId
  )
  const isManagerOrAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.MANAGER

  // Section edit permission:
  // Outgoing engineer or manager can edit if in draft, in_preparation, or revision_requested
  const EDITABLE_STATUSES = [
    HANDOVER_STATUS.DRAFT,
    HANDOVER_STATUS.IN_PREPARATION,
    HANDOVER_STATUS.REVISION_REQUESTED,
  ]
  const canEditSection =
    (isOutgoing || isManagerOrAdmin) &&
    EDITABLE_STATUSES.includes(handover?.status)

  // Count completed sections
  const completedSectionsCount = HANDOVER_SECTIONS.reduce((count, sec) => {
    return handover?.sections?.[sec.key]?.isComplete ? count + 1 : count
  }, 0)
  const allSectionsComplete = completedSectionsCount === HANDOVER_SECTIONS.length

  // Lifecycle Action Permissions
  const canSubmitForReview =
    (isOutgoing || isManagerOrAdmin) &&
    allSectionsComplete &&
    [HANDOVER_STATUS.IN_PREPARATION, HANDOVER_STATUS.REVISION_REQUESTED].includes(handover?.status)

  const canReview =
    isManagerOrAdmin &&
    handover?.status === HANDOVER_STATUS.SUBMITTED_FOR_REVIEW

  const canAcknowledge =
    (isIncoming || role === USER_ROLES.ADMIN) &&
    handover?.status === HANDOVER_STATUS.READY_FOR_ACKNOWLEDGEMENT

  // 4. Save Section Content
  const saveSection = async (customContent = draftContent, customIsComplete = isSectionComplete) => {
    if (!canEditSection || !handoverId) return
    setIsSaving(true)
    setError(null)
    setSaveSuccessMessage(null)

    try {
      const response = await updateHandoverSectionApi(handoverId, {
        sectionKey: activeSectionKey,
        content: customContent,
        isComplete: customIsComplete,
      })
      if (response?.handover) {
        setHandover(response.handover)
        setSaveSuccessMessage('Section saved successfully.')
        setTimeout(() => setSaveSuccessMessage(null), 3000)
      }
    } catch (err) {
      setError(err?.message || 'Failed to save section.')
    } finally {
      setIsSaving(false)
    }
  }

  // 5. Submit for Review
  const submitForReview = async () => {
    if (!canSubmitForReview || !handoverId) return
    setActionLoading(true)
    setError(null)
    try {
      const response = await submitHandoverForReviewApi(handoverId)
      if (response?.handover) {
        setHandover(response.handover)
      }
    } catch (err) {
      setError(err?.message || 'Failed to submit handover.')
    } finally {
      setActionLoading(false)
    }
  }

  // 6. Review (Approve or Request Revision)
  const submitReview = async (action, reviewNotes = '') => {
    if (!canReview || !handoverId) return
    setActionLoading(true)
    setError(null)
    try {
      const response = await reviewHandoverApi(handoverId, { action, reviewNotes })
      if (response?.handover) {
        setHandover(response.handover)
      }
    } catch (err) {
      setError(err?.message || 'Failed to record review.')
    } finally {
      setActionLoading(false)
    }
  }

  // 7. Acknowledge & Sign off
  const acknowledgeHandover = async () => {
    if (!canAcknowledge || !handoverId) return
    setActionLoading(true)
    setError(null)
    try {
      const response = await acknowledgeHandoverApi(handoverId)
      if (response?.handover) {
        setHandover(response.handover)
      }
    } catch (err) {
      setError(err?.message || 'Failed to acknowledge handover.')
    } finally {
      setActionLoading(false)
    }
  }

  return {
    handover,
    loading,
    error,
    setError,
    activeSectionKey,
    setActiveSectionKey,
    draftContent,
    setDraftContent,
    isSectionComplete,
    setIsSectionComplete,
    isSaving,
    saveSuccessMessage,
    actionLoading,
    // Permissions & Counts
    isOutgoing,
    isIncoming,
    isManagerOrAdmin,
    canEditSection,
    canSubmitForReview,
    canReview,
    canAcknowledge,
    completedSectionsCount,
    allSectionsComplete,
    // Handlers
    saveSection,
    submitForReview,
    submitReview,
    acknowledgeHandover,
    refetch: fetchHandover,
  }
}
