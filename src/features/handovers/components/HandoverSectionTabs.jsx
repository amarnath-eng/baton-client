import SelectDropdown from '../../../components/ui/SelectDropdown.jsx'
import { HANDOVER_SECTIONS } from '../../../constants/handover.js'

/**
 * Single Responsibility: Renders the section navigation tabs (mobile dropdown and desktop segmented pills)
 * for the 6 technical continuity sections.
 */
export default function HandoverSectionTabs({
  activeSectionKey,
  setActiveSectionKey,
  sections,
}) {
  return (
    <>
      {/* Mobile: SelectDropdown for fast, tactile section jumping */}
      <div className="sm:hidden">
        <SelectDropdown
          value={activeSectionKey}
          onChange={setActiveSectionKey}
          options={HANDOVER_SECTIONS.map((sec, idx) => ({
            label: `${idx + 1}. ${sec.title.split('&')[0].trim()} ${
              sections?.[sec.key]?.isComplete ? '✓' : ''
            }`,
            value: sec.key,
          }))}
        />
      </div>

      {/* Desktop / Tablet: Horizontal Segmented Pills */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-900">
        {HANDOVER_SECTIONS.map((sec, idx) => {
          const isCompleted = Boolean(sections?.[sec.key]?.isComplete)
          const isActive = activeSectionKey === sec.key

          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSectionKey(sec.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </span>
              <span>{sec.title.split('&')[0].trim()}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

