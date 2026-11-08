import { useState, useEffect } from 'react'
import { resendInvitationApi } from '../../../services/invitationApi.js'
import { getActiveTimeRemaining } from '../utils/formatters.js'

/**
 * Resend button component with nested countdown banner.
 * Triggers resend notification and logs invitation URL strictly to developer console.
 */
export default function CopyInviteLink({
  inviteUrl,
  id,
  expiresAt,
  isCopied,
  onCopy,
  onRevoke,
  actionLoading = false,
  variant = 'button',
}) {
  const [justResent, setJustResent] = useState(false)
  const [confirmingRevoke, setConfirmingRevoke] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  if (!inviteUrl && !id) return null

  const handleResend = async (e) => {
    e.stopPropagation()
    // Print directly to browser console as well
    if (inviteUrl) {
      console.log('[Baton Resent Invitation Link]:', inviteUrl)
    }

    setJustResent(true)
    setTimeout(() => setJustResent(false), 2000)

    try {
      if (id) {
        await resendInvitationApi(id)
      }
    } catch (_) {
      // Backend resend attempted; link is still refreshed and logged
    }

    if (onCopy && inviteUrl) {
      onCopy(inviteUrl, id)
    }
  }

  const handleConfirmRevoke = (e) => {
    e.stopPropagation()
    if (onRevoke && id) {
      onRevoke(id)
    }
    setConfirmingRevoke(false)
  }

  const isSent = justResent || isCopied

  if (variant === 'bar') {
    const activeTime = expiresAt ? getActiveTimeRemaining(expiresAt, now) : null

    return (
      <div className="flex items-center justify-between gap-2 bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3 py-1.5 text-xs">
        <span className="text-[11px] text-zinc-400 font-medium font-mono truncate">
          {activeTime ? (
            <>
              Invite Active Time:{' '}
              <span
                className={`font-semibold ${
                  activeTime.isExpired
                    ? 'text-rose-400'
                    : activeTime.isUrgent
                    ? 'text-amber-400'
                    : 'text-zinc-200'
                }`}
              >
                {activeTime.text}
              </span>
            </>
          ) : (
            '7-day invite active'
          )}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResend}
            className={`text-[11px] font-medium px-2.5 py-1 rounded transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              isSent
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700'
            }`}
            title="Resend invitation link (logged to console)"
          >
            {isSent ? (
              <span className="text-emerald-400 font-semibold">✓ Resent!</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Resend</span>
              </>
            )}
          </button>

          {onRevoke && (
            confirmingRevoke ? (
              <div className="flex items-center gap-1 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={handleConfirmRevoke}
                  disabled={actionLoading}
                  className="text-[11px] font-medium px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 transition cursor-pointer disabled:opacity-50"
                >
                  Confirm?
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmingRevoke(false)
                  }}
                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition cursor-pointer text-xs"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmingRevoke(true)
                }}
                disabled={actionLoading}
                className="text-[11px] font-medium px-2 py-1 rounded border border-rose-500/25 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
              >
                Revoke
              </button>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleResend}
      className={`text-[11px] font-medium px-2.5 py-1 rounded border transition cursor-pointer flex items-center gap-1.5 ${
        isSent
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-800'
      }`}
      title="Resend invitation link (logged to console)"
    >
      {isSent ? (
        <span className="text-emerald-400 font-semibold">✓ Resent!</span>
      ) : (
        <>
          <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Resend</span>
        </>
      )}
    </button>
  )
}
