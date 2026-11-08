import { Link } from 'react-router-dom'
import { buildRoute } from '../../../routes/paths.js'

/**
 * WorkspaceCollisionCard
 * Industry-standard collision resolution (Linear / Slack / GitHub pattern).
 * Clean visual hierarchy, unclipped domain slug, and mobile-responsive action buttons.
 */
export function WorkspaceCollisionCard({
  type = 'slug_collision', // 'name_and_slug_collision' | 'slug_collision' | 'name_exists_slug_unique'
  currentSlug,
  currentCompanyName,
  existingCompany,
  onRequestAccess,
  onSelectSlug,
}) {
  const existingSlug = existingCompany?.slug || currentSlug
  const existingName = existingCompany?.name || currentCompanyName || existingSlug

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 1: Company name exists, BUT Current URL Slug is Available
  // ─────────────────────────────────────────────────────────────
  if (type === 'name_exists_slug_unique') {
    return (
      <div className="space-y-3 text-left animate-in fade-in slide-in-from-top-1 duration-200">
        {/* Prominent High-Contrast Available Status */}
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
          <p className="text-xs text-emerald-300 font-medium leading-relaxed break-words">
            <code className="text-white font-mono font-semibold break-words">batondev.in/{currentSlug}</code>{' '}
            is available for your company.
          </p>
        </div>

        {/* Existing Company Disambiguation Callout with Clear Stacked Details */}
        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-zinc-400">
            <span className="text-xs font-medium text-zinc-400">Existing workspace on Baton:</span>
            <div className="flex items-center gap-2 text-xs font-medium shrink-0">
              <Link
                to={buildRoute.loginWithWorkspace(existingSlug)}
                className="text-zinc-300 hover:text-white underline transition"
              >
                Sign In
              </Link>
              <span className="text-zinc-600">·</span>
              <button
                type="button"
                onClick={() => onRequestAccess?.(existingSlug, existingName)}
                className="text-zinc-300 hover:text-white underline transition cursor-pointer"
              >
                Request Access
              </button>
            </div>
          </div>

          {/* Company Name and Domain Slug displayed stacked & crystal clear */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1">
            <div className="text-sm font-bold text-white tracking-[0.015em] break-words">
              {existingName}
            </div>
            <div className="text-xs font-mono text-zinc-300 tracking-[0.025em] break-all">
              batondev.in/{existingSlug}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 2: URL Slug is Taken
  // ─────────────────────────────────────────────────────────────
  const baseSlug = (currentSlug || 'workspace').replace(/-(corp|global|hq|co)$/, '')
  const suggestions = [
    `${baseSlug}-corp`,
    `${baseSlug}-global`,
    `${baseSlug}-hq`,
  ].filter((sug) => sug !== currentSlug).slice(0, 2)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-4 space-y-3.5 text-left text-xs shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Existing Workspace Header: Name & Badge on Row 1, Full-Width URL on Row 2 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-bold text-white tracking-[0.015em] break-words truncate">
            {existingName}
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono tracking-wider uppercase font-semibold shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Already Registered
          </span>
        </div>
        <div className="text-xs font-mono text-zinc-400 tracking-[0.025em] break-all">
          batondev.in/{existingSlug}
        </div>
      </div>

      {/* Path 1: If You Work Here */}
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <span className="text-zinc-400 text-xs font-medium">
          Belong to this company?
        </span>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <Link
            to={buildRoute.loginWithWorkspace(existingSlug)}
            className="inline-flex items-center justify-center px-3 py-2 sm:py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition active:scale-98 shadow-xs text-center"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => onRequestAccess?.(existingSlug, existingName)}
            className="inline-flex items-center justify-center px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700/80 transition active:scale-98 cursor-pointer text-center whitespace-nowrap"
          >
            Request Access
          </button>
        </div>
      </div>

      {/* Path 2: If Creating a New Company -> One-Click Available Suggestions */}
      <div className="pt-0.5 space-y-2">
        <span className="text-zinc-400 block text-xs">
          Creating a new company? Choose an available URL:
        </span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-1.5 sm:gap-2">
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onSelectSlug?.(sug)}
              className="inline-flex items-center justify-between sm:justify-start gap-2 px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition cursor-pointer font-mono text-[11px] group active:scale-98"
            >
              <span className="break-all text-left">batondev.in/{sug}</span>
              <span className="text-zinc-500 group-hover:text-zinc-300 text-[10px] shrink-0 font-sans">↵</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
