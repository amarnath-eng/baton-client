import { Link } from 'react-router-dom'
import { buildRoute } from '../../../routes/paths.js'

/**
 * WorkspaceCollisionCard
 * Industry-standard collision resolution (Linear / Slack / GitHub pattern).
 * Clean visual hierarchy, stacked company name and domain slug, and minimal cognitive load.
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
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="min-w-0 text-xs">
              <span className="text-emerald-300 font-medium">
                <code className="text-white font-mono font-semibold">batondev.in/{currentSlug}</code> is available for your company.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold shrink-0">
            Ready
          </span>
        </div>

        {/* Existing Company Disambiguation Callout with Clear Stacked Details */}
        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-2 text-zinc-400">
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
            <div className="text-sm font-bold text-white tracking-[0.015em]">
              {existingName}
            </div>
            <div className="text-xs font-mono text-zinc-300 tracking-[0.025em]">
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-3.5 text-left text-xs shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Existing Workspace Header (Rendered once, prominently) */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="text-sm font-bold text-white tracking-[0.015em] truncate">
            {existingName}
          </div>
          <div className="text-xs font-mono text-zinc-400 tracking-[0.025em] truncate">
            batondev.in/{existingSlug}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono tracking-wider uppercase font-semibold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Already Registered
        </span>
      </div>

      {/* Path 1: If You Work Here */}
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <span className="text-zinc-400 text-xs">
          Belong to this company?
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={buildRoute.loginWithWorkspace(existingSlug)}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition active:scale-98 shadow-xs"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => onRequestAccess?.(existingSlug, existingName)}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700/80 transition active:scale-98 cursor-pointer"
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
        <div className="flex flex-wrap items-center gap-1.5">
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onSelectSlug?.(sug)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition cursor-pointer font-mono text-[11px]"
            >
              <span>batondev.in/{sug}</span>
              <span className="text-zinc-500 text-[10px]">↵</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
