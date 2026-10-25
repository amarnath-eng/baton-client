import { useState } from 'react'
import { TableLoading, TableEmpty } from '../../../components/ui/Table.jsx'
import { useClipboardCopy } from '../../../hooks/useClipboardCopy.js'
import InvitationsMobileList from './InvitationsMobileList.jsx'
import InvitationsDesktopTable from './InvitationsDesktopTable.jsx'

/**
 * InvitationsTable orchestrator component.
 * Manages view state and delegates to mobile and desktop presentation views.
 */
export default function InvitationsTable({
  invitations = [],
  loading = false,
  actionLoadingId = null,
  canInvite = false,
  onRevoke,
}) {
  const [confirmingRevokeId, setConfirmingRevokeId] = useState(null)
  const { copiedId, copyToClipboard } = useClipboardCopy()

  if (loading) {
    return <TableLoading message="Loading invitations..." />
  }

  if (invitations.length === 0) {
    return (
      <TableEmpty
        title="No sent invitations"
        description="Dispatched 7-day cryptographic team invitations will appear here."
      />
    )
  }

  const sharedProps = {
    invitations,
    canInvite,
    actionLoadingId,
    confirmingRevokeId,
    setConfirmingRevokeId,
    copiedId,
    onCopy: copyToClipboard,
    onRevoke,
  }

  return (
    <>
      <InvitationsMobileList {...sharedProps} />
      <InvitationsDesktopTable {...sharedProps} />
    </>
  )
}
