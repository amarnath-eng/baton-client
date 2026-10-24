export function RequestAccessSuccess({ companySlug, companyName, role, onClose }) {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
        ✓
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Access Request Submitted!</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Your request to join <span className="text-white font-medium">"{companyName || companySlug}"</span> as a{' '}
          <span className="text-white font-medium capitalize">{role}</span> has been sent to the workspace administrators.
        </p>
      </div>
      <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
        You will receive an email notification as soon as your request is reviewed.
      </p>
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition active:scale-95 shadow-sm cursor-pointer select-none"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
