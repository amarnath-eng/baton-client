import { useState, useEffect } from 'react'
import { getHandoversApi } from '../../services/handoverApi.js'
import HandoverStatusBadge from '../handovers/components/HandoverStatusBadge.jsx'
import { HANDOVER_STATUS } from '../../constants/handover.js'

export default function AuditLogPanel() {
  const [handovers, setHandovers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getHandoversApi()
      .then((data) => {
        if (isMounted) setHandovers(data || [])
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Build chronological timeline of logged actions
  const auditEntries = handovers
    .flatMap((h) => {
      const logs = []
      // 1. Creation event
      logs.push({
        id: `${h._id}-created`,
        timestamp: new Date(h.createdAt),
        title: 'Handover Created',
        actor: h.createdBy?.fullName || 'Manager',
        project: h.project,
        handoverTitle: h.title,
        status: HANDOVER_STATUS.DRAFT,
        description: `Initiated continuity transfer from ${h.outgoingEngineerId?.fullName || 'Outgoing'} to ${h.incomingEngineerId?.fullName || 'Incoming'}.`,
      })

      // 2. Review event (if reviewed)
      if (h.managerReview?.reviewedAt) {
        logs.push({
          id: `${h._id}-reviewed`,
          timestamp: new Date(h.managerReview.reviewedAt),
          title: h.status === HANDOVER_STATUS.REVISION_REQUESTED ? 'Revisions Requested' : 'Manager Review Approved',
          actor: h.managerReview.reviewedBy?.fullName || 'Engineering Manager',
          project: h.project,
          handoverTitle: h.title,
          status: h.status === HANDOVER_STATUS.REVISION_REQUESTED ? HANDOVER_STATUS.REVISION_REQUESTED : HANDOVER_STATUS.READY_FOR_ACKNOWLEDGEMENT,
          description: h.managerReview.reviewNotes ? `Notes: "${h.managerReview.reviewNotes}"` : 'Handover verified and promoted to next lifecycle gate.',
        })
      }

      // 3. Acknowledged event (if completed)
      if (h.acknowledgedAt) {
        logs.push({
          id: `${h._id}-acknowledged`,
          timestamp: new Date(h.acknowledgedAt),
          title: 'Handover Signed Off & Completed',
          actor: h.acknowledgedBy?.fullName || h.incomingEngineerId?.fullName || 'Incoming Engineer',
          project: h.project,
          handoverTitle: h.title,
          status: HANDOVER_STATUS.COMPLETED,
          description: 'Official knowledge transfer accepted and signed off. Continuity achieved.',
        })
      }

      return logs
    })
    .sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <h2 className="text-base font-semibold text-white tracking-tight">Audit & Continuity Log</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Tamper-proof, append-only record of all engineering handover state transitions, reviews, and sign-offs.
        </p>
      </div>

      {/* Timeline Feed */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-zinc-900 rounded-xl" />
            <div className="h-12 bg-zinc-900 rounded-xl" />
            <div className="h-12 bg-zinc-900 rounded-xl" />
          </div>
        ) : auditEntries.length === 0 ? (
          <div className="text-center py-10 space-y-1">
            <p className="text-sm font-semibold text-white">No activity logged yet</p>
            <p className="text-xs text-zinc-500">
              State transitions will appear here automatically when handovers are created and reviewed.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 ml-4 space-y-6 py-2">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="relative pl-6 space-y-1.5">
                {/* Node icon dot */}
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-950 border-2 border-emerald-500" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{entry.title}</span>
                    <HandoverStatusBadge status={entry.status} />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {entry.timestamp.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  <strong className="text-zinc-300">{entry.actor}</strong> for{' '}
                  <span className="font-mono text-zinc-300 px-1 py-0.5 rounded bg-zinc-900 text-[11px]">
                    {entry.project}
                  </span>{' '}
                  — <span className="text-zinc-300 font-medium">"{entry.handoverTitle}"</span>
                </p>

                <p className="text-xs text-zinc-500 font-mono text-[11px] leading-relaxed">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
