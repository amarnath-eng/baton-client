export function RequestAccessSuccess({ companySlug, companyName, role, onClose }) {
  return (
    <div className="py-1 space-y-4 text-left">
      {/* Visual Status Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-0.5 min-w-0">
          <h4 className="text-xs font-semibold text-white">Application Dispatched</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Workspace administrators have received your application and will review your profile.
          </p>
        </div>
      </div>

      {/* Structured Details Receipt */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5">
        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Submission Summary
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block">Workspace</span>
            <span className="font-mono text-zinc-200 font-semibold truncate block mt-0.5">
              {companySlug}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block">Requested Role</span>
            <span className="text-zinc-200 font-semibold capitalize block mt-0.5">
              {role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Status: <strong className="text-zinc-200 font-medium">Pending Review</strong></span>
        </div>
      </div>

      {/* Next Steps Note */}
      <p className="text-[11px] text-zinc-500 px-1 leading-normal">
        You will receive an automated email notification once an administrator reviews and assigns your workspace permissions.
      </p>

      {/* Primary Action Button */}
      <div className="pt-3.5 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] text-black text-xs font-semibold transition cursor-pointer shadow-sm text-center"
        >
          Return to home
        </button>
      </div>
    </div>
  )
}
