/**
 * Reusable Copy Invite Link component supporting both full-bar (mobile) and button-badge (desktop) layouts
 */
export default function CopyInviteLink({
  inviteUrl,
  id,
  isCopied,
  onCopy,
  variant = 'button',
}) {
  if (!inviteUrl) return null

  if (variant === 'bar') {
    return (
      <div className="flex items-center justify-between gap-2 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs">
        <span className="font-mono text-[10px] text-zinc-400 truncate flex-1 select-all">
          {inviteUrl}
        </span>
        <button
          type="button"
          onClick={() => onCopy(inviteUrl, id)}
          className="text-[11px] font-medium text-zinc-200 hover:text-white px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer shrink-0 flex items-center gap-1"
        >
          {isCopied ? (
            <span className="text-emerald-400 font-semibold">✓ Copied</span>
          ) : (
            <>
              <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onCopy(inviteUrl, id)}
      className="text-[11px] font-medium text-zinc-300 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1"
      title="Copy 7-day invitation link"
    >
      {isCopied ? (
        <span className="text-emerald-400 font-semibold">✓ Copied</span>
      ) : (
        <>
          <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy Link</span>
        </>
      )}
    </button>
  )
}
