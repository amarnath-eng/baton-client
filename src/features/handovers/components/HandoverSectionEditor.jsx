import { Button } from '../../../components/ui/Button.jsx'
import { HANDOVER_SECTIONS } from '../../../constants/handover.js'

export default function HandoverSectionEditor({
  sectionKey,
  content,
  isComplete,
  canEdit,
  isSaving,
  saveSuccessMessage,
  onContentChange,
  onCompleteToggle,
  onSave,
}) {
  const currentSectionMeta = HANDOVER_SECTIONS.find((s) => s.key === sectionKey) || {
    title: 'Section Content',
    description: 'Provide technical details for this continuity topic.',
  }

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Section Header & Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            {currentSectionMeta.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {currentSectionMeta.description}
          </p>
        </div>

        {/* Completion Checkbox Pill */}
        <label
          className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition select-none ${
            isComplete
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            type="checkbox"
            checked={isComplete}
            disabled={!canEdit}
            onChange={(e) => onCompleteToggle(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-zinc-700 text-emerald-500 focus:ring-0 bg-zinc-950 cursor-pointer"
          />
          <span>{isComplete ? 'Section Completed' : 'Mark as Complete'}</span>
        </label>
      </div>

      {/* Editor Body */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="font-mono text-[11px] uppercase tracking-wider">
            Markdown Supported
          </span>
          {saveSuccessMessage && (
            <span className="text-emerald-400 font-medium animate-fade-in">
              ✓ {saveSuccessMessage}
            </span>
          )}
        </div>

        <textarea
          rows={12}
          value={content}
          disabled={!canEdit}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={
            canEdit
              ? `Document the ${currentSectionMeta.title.toLowerCase()} here...\n\nTips:\n- Use Markdown lists (- or 1.)\n- Include relevant repository file links or PR links\n- Note edge cases or gotchas`
              : 'No content documented for this section yet.'
          }
          className={`w-full font-mono text-xs text-zinc-200 placeholder-zinc-600 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 leading-relaxed resize-y ${
            !canEdit ? 'opacity-80 bg-zinc-900/40 cursor-default' : ''
          }`}
        />
      </div>

      {/* Editor Footer / Actions */}
      {canEdit && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <p className="text-[11px] text-zinc-500">
            Ensure details are complete before marking as done.
          </p>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs bg-white text-black hover:bg-zinc-200"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}
