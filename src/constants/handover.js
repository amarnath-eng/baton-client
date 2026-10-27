export const HANDOVER_STATUS = Object.freeze({
  DRAFT: 'draft',
  IN_PREPARATION: 'in_preparation',
  SUBMITTED_FOR_REVIEW: 'submitted_for_review',
  REVISION_REQUESTED: 'revision_requested',
  READY_FOR_ACKNOWLEDGEMENT: 'ready_for_acknowledgement',
  COMPLETED: 'completed',
})

export const HANDOVER_STATUSES = Object.freeze(Object.values(HANDOVER_STATUS))

export const HANDOVER_STATUS_LABELS = Object.freeze({
  [HANDOVER_STATUS.DRAFT]: 'Draft',
  [HANDOVER_STATUS.IN_PREPARATION]: 'In Preparation',
  [HANDOVER_STATUS.SUBMITTED_FOR_REVIEW]: 'Under Review',
  [HANDOVER_STATUS.REVISION_REQUESTED]: 'Changes Requested',
  [HANDOVER_STATUS.READY_FOR_ACKNOWLEDGEMENT]: 'Ready for Sign-off',
  [HANDOVER_STATUS.COMPLETED]: 'Completed',
})

export const HANDOVER_STATUS_COLORS = Object.freeze({
  [HANDOVER_STATUS.DRAFT]: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  [HANDOVER_STATUS.IN_PREPARATION]: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  [HANDOVER_STATUS.SUBMITTED_FOR_REVIEW]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [HANDOVER_STATUS.REVISION_REQUESTED]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  [HANDOVER_STATUS.READY_FOR_ACKNOWLEDGEMENT]: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  [HANDOVER_STATUS.COMPLETED]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
})

export const HANDOVER_SECTIONS = Object.freeze([
  {
    key: 'completedWork',
    title: 'Completed Work & Architecture Overview',
    description: 'Summary of features delivered, high-level architecture, and repositories touched.',
  },
  {
    key: 'pendingTasks',
    title: 'In-Flight Tasks & Immediate Next Steps',
    description: 'Unfinished PRs, staged branches, and backlog priorities that need immediate attention.',
  },
  {
    key: 'bugsAndBlockers',
    title: 'Known Bugs, Quirks & Blockers',
    description: 'Edge cases, intermittent issues, technical debt, and undocumented quirks.',
  },
  {
    key: 'technicalDecisions',
    title: 'Technical Decisions & Rationale',
    description: 'Why specific libraries, patterns, or architecture choices were made.',
  },
  {
    key: 'dependenciesAndRisks',
    title: 'Key Dependencies & Failure Points',
    description: 'Third-party APIs, infra bottlenecks, single-points-of-failure, and security considerations.',
  },
  {
    key: 'setupInstructions',
    title: 'Local Setup, Secrets & Verification',
    description: 'Environment variables needed, seed data commands, and sanity check verification steps.',
  },
])
