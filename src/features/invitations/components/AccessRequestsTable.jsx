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

  if (requests.length === 0) {
    const emptyDetails = {
      pending: {
        title: 'No pending requests',
        description: 'There are currently no access requests waiting for review.',
      },
      approved: {
        title: 'No approved requests',
        description: 'Approved workspace access requests will appear here.',
      },
      rejected: {
        title: 'No rejected requests',
        description: 'Rejected workspace access requests will appear here.',
      },
      all: {
        title: 'No access requests',
        description: 'Incoming requests to join your company workspace will appear here.',
      },
    }
    const current = emptyDetails[filterStatus] || emptyDetails.all
    return (
      <TableEmpty
        title={current.title}
        description={current.description}
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
    confirmingRevokeId,
    setConfirmingRevokeId,
    copiedId,
    onCopy: copyToClipboard,
    onReview,
    onRevoke,
  }

  return (
    <>
      <AccessRequestsMobileList {...sharedProps} />
      <AccessRequestsDesktopTable {...sharedProps} />
    </>
  )
}
