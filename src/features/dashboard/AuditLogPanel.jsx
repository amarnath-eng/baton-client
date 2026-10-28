export default function AuditLogPanel() {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-white">Audit Log</h2>
      <p className="text-xs text-zinc-400 mt-0.5">
        Tamper-proof, append-only record of all handover state transitions and access reviews.
      </p>
    </div>
  )
}
