import { useState } from 'react'
import { Button } from '../../../components/ui/Button.jsx'

export default function ApprovedInviteBanner({ inviteUrl, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!inviteUrl) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-300">
          Approved Invitation Link Generated (Valid for 7 days)
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-white text-xs cursor-pointer p-1"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
    </div>
  )
}
