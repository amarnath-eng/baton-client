/**
 * Static workflow phases and 6 core modules data definitions for landing page.
 */
export const PHASE_1_STEPS = [
  {
    number: '01',
    title: 'Manager Creates Handover',
    role: 'Engineering Manager',
    description:
      'The manager creates the handover workspace, specifies the service name, assigns the Outgoing and Incoming Engineers, and sets the deadline.',
    badge: '✓ Clear ownership from day one',
  },
  {
    number: '02',
    title: 'Write the 6 Modules',
    role: 'Outgoing Engineer',
    isModulesStep: true,
    description:
      'The outgoing engineer documents local setup commands, working .env keys, in-flight PR branches, and architecture decisions before submission.',
    badge: '✓ 6 structured modules enforced',
  },
  {
    number: '03',
    title: 'Manager Review',
    role: 'Engineering Manager',
    description:
      'The manager verifies completeness. If any API key or repo link is missing, changes are requested before the incoming engineer tests.',
    badge: '✓ Prevents incomplete handovers',
  },
]

export const PHASE_2_STEPS = [
  {
    number: '04',
    title: 'Two-Way Verification',
    role: 'Incoming Engineer',
    description:
      'The incoming engineer runs setup steps locally. Any failure is logged as a blocker issue that must be fixed and re-tested before sign-off.',
    badge: '✓ Only incoming engineer verifies fixes',
  },
  {
    number: '05',
    title: 'Check & Sign-Off',
    role: 'Readiness Gate',
    description:
      'Baton automatically verifies 100% of tasks have owners, all 6 modules are complete, and zero blockers remain before recording the audit trail.',
    badge: '✓ Permanent audit trail recorded',
  },
]

export const CORE_MODULES = [
  {
    number: '01',
    title: 'Completed Work',
    description: 'Delivered features, architecture overview, and PR/repository links.',
  },
  {
    number: '02',
    title: 'Pending Tasks',
    description: 'Unfinished PRs, active branch names, priorities, and assigned owners.',
  },
  {
    number: '03',
    title: 'Bugs & Blockers',
    description: 'Known bugs, flaky tests, edge cases, technical debt, and workarounds.',
  },
  {
    number: '04',
    title: 'Technical Decisions',
    description: 'Architecture Decision Records (ADRs), trade-offs considered, and rationale.',
  },
  {
    number: '05',
    title: 'Dependencies & Risks',
    description: 'Third-party APIs, vendor credentials, failure points, and team contacts.',
  },
  {
    number: '06',
    title: 'Setup Instructions',
    description: 'Local environment run commands, sample test data, and .env keys.',
  },
]

