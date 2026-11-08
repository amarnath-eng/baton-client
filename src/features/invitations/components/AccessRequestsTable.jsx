import { useState } from 'react'
import { TableLoading } from '../../../components/ui/Table.jsx'
import { useClipboardCopy } from '../../../hooks/useClipboardCopy.js'
import AccessRequestsMobileList from './AccessRequestsMobileList.jsx'
import AccessRequestsDesktopTable from './AccessRequestsDesktopTable.jsx'

/**
 * AccessRequestsTable orchestrator component.
 * Manages view state and delegates to mobile and desktop presentation views.
 * Preserves the table shell across filter transitions to prevent layout shifts.
 */
export default function AccessRequestsTable({
  requests = [],
  filterStatus = 'all',
  loading = false,
  actionLoadingId = null,
  onReview,
  onRevoke,
}) {
  const [confirmingRejectId, setConfirmingRejectId] = useState(null)
  const [confirmingApproveId, setConfirmingApproveId] = useState(null)
  const [confirmingRevokeId, setConfirmingRevokeId] = useState(null)
  const { copiedId, copyToClipboard } = useClipboardCopy()

  if (loading) {
    return <TableLoading message="Loading access requests..." />
  }

  const handleReview = async (id, action, requestedRole, reviewNotes, req) => {
    setConfirmingRejectId(null)
    setConfirmingApproveId(null)
    return onReview?.(id, action, requestedRole, reviewNotes, req)
  }

  const handleRevoke = async (id) => {
    setConfirmingRevokeId(null)
    return onRevoke?.(id)
  }

  const sharedProps = {
    requests,
    filterStatus,
    actionLoadingId,
    confirmingRejectId,
    setConfirmingRejectId,
    confirmingApproveId,
    setConfirmingApproveId,
    confirmingRevokeId,
    setConfirmingRevokeId,
    copiedId,
    onCopy: copyToClipboard,
    onReview: handleReview,
    onRevoke: handleRevoke,
  }

  return (
    <>
      <AccessRequestsMobileList {...sharedProps} />
      <AccessRequestsDesktopTable {...sharedProps} />
    </>
  )
}
