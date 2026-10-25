import { useState } from 'react'
import { TableLoading, TableEmpty } from '../../../components/ui/Table.jsx'
import { useClipboardCopy } from '../../../hooks/useClipboardCopy.js'
import AccessRequestsMobileList from './AccessRequestsMobileList.jsx'
import AccessRequestsDesktopTable from './AccessRequestsDesktopTable.jsx'

/**
 * AccessRequestsTable orchestrator component.
 * Manages view state and delegates to mobile and desktop presentation views.
 */
export default function AccessRequestsTable({
  requests = [],
  loading = false,
  actionLoadingId = null,
  onReview,
}) {
  const [confirmingRejectId, setConfirmingRejectId] = useState(null)
  const [confirmingApproveId, setConfirmingApproveId] = useState(null)
  const { copiedId, copyToClipboard } = useClipboardCopy()

  if (loading) {
    return <TableLoading message="Loading access requests..." />
  }

  if (requests.length === 0) {
    return (
      <TableEmpty
        title="No access requests"
        description="Incoming requests to join your company workspace will appear here."
      />
    )
  }

  const sharedProps = {
    requests,
    actionLoadingId,
    confirmingRejectId,
    setConfirmingRejectId,
    confirmingApproveId,
    setConfirmingApproveId,
    copiedId,
    onCopy: copyToClipboard,
    onReview,
  }

  return (
    <>
      <AccessRequestsMobileList {...sharedProps} />
      <AccessRequestsDesktopTable {...sharedProps} />
    </>
  )
}
