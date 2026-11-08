import { useState, useEffect } from 'react'
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
  onReinvite,
}) {
  const [confirmingRevokeId, setConfirmingRevokeId] = useState(null)
  const { copiedId, copyToClipboard } = useClipboardCopy()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
    onReinvite,
    now,
  }

  return (
    <>
      <InvitationsMobileList {...sharedProps} />
      <InvitationsDesktopTable {...sharedProps} />
    </>
  )
}
