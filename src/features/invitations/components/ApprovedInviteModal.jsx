import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal.jsx'
import { Button } from '../../../components/ui/Button.jsx'

export default function ApprovedInviteModal({ isOpen, onClose, inviteData }) {
  const [copied, setCopied] = useState(false)

  if (!inviteData) return null

  const url = typeof inviteData === 'string' ? inviteData : inviteData.url
  const name = typeof inviteData === 'object' ? inviteData.name : ''
  const role = typeof inviteData === 'object' ? inviteData.role : ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  async function handleCopyAndClose() {
    await handleCopy()
    setTimeout(() => {
      onClose()
    }, 350)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Access Request Approved"
      subtitle={
        name
          ? `Generated a 7-day invitation link for ${name}${role ? ` (${role})` : ''}.`
          : 'A 7-day invitation link has been generated.'
      }
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Status Callout */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-emerald-300">
              Workspace access approved
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              The applicant can use this link to sign in and join your workspace. This link is valid for 7 days.
            </p>
          </div>
        </div>

        {/* Invitation Link Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-400">
            Cryptographic Invitation Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              onClick={(e) => e.target.select()}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-700 select-all"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className={`shrink-0 text-xs py-2 px-3 transition-colors ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : ''
              }`}
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleCopyAndClose}
          >
            {copied ? 'Copied to Clipboard' : 'Copy & Close'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
