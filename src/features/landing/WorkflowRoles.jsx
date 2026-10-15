import { Badge } from '../../components/ui/Badge.jsx'
import { Card } from '../../components/ui/Card.jsx'

export function WorkflowRoles() {
  const steps = [
    { num: '01', title: 'Workspace Setup', actor: 'Admin', desc: 'Registers company workspace and invites team members.' },
    { num: '02', title: 'Create Handover', actor: 'Manager', desc: 'Selects project, outgoing engineer, incoming engineer, and deadline.' },
    { num: '03', title: 'Prepare Documentation', actor: 'Outgoing Engineer', desc: 'Fills the structured handover modules and submits for review.' },
    { num: '04', title: 'Manager Review', actor: 'Manager', desc: 'Validates completeness; accepts for verification or requests revisions.' },
    { num: '05', title: 'Incoming Verification', actor: 'Incoming Engineer', desc: 'Tests setup runbook and flags discrepancies as first-class issues.' },
    { num: '06', title: 'Resolve & Re-verify', actor: 'Assigned / Receiver', desc: 'Assignee fixes issue; incoming engineer re-verifies and closes.' },
    { num: '07', title: 'Readiness Evaluation', actor: 'Server Engine', desc: 'Backend evaluates all 7 mandatory rules against database records.' },
    { num: '08', title: 'Acknowledgement', actor: 'Incoming Engineer', desc: 'Receiver formally acknowledges handover once all checks pass.' },
    { num: '09', title: 'Completion & Audit', actor: 'System', desc: 'Handover marked complete; all history preserved in audit trail.' },
  ]

  const roles = [
    {
      name: 'Company Admin',
      badge: 'Workspace Scope',
      desc: 'Sets up and administers the company workspace.',
      items: [
        'Registers company workspace & becomes first admin',
        'Invites managers and engineers via secure token links',
        'Manages company memberships and role access',
        'Views company-level audit history and activity',
      ],
    },
    {
      name: 'Manager',
      badge: 'Coordinator',
      desc: 'Coordinates and reviews handovers across teams.',
      items: [
        'Creates handovers between two engineers with deadlines',
        'Reviews submitted documentation for completeness',
        'Requests revisions with feedback or accepts for verification',
        'Tracks unresolved blockers and readiness status',
      ],
    },
    {
      name: 'Engineer',
      badge: 'Contextual Role',
      desc: 'Documents, verifies, or resolves engineering work.',
      items: [
        'Outgoing engineer: authors structured handover modules',
        'Incoming engineer: verifies instructions & raises issues',
        'Assigned engineer: investigates and resolves issues',
        'Incoming engineer: re-verifies fixes and acknowledges',
      ],
    },
  ]

  return (
    <section id="workflow" className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8 space-y-12">
      {/* 9-Step Lifecycle Flow */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            End-to-End Lifecycle &bull; Section 3
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1 text-balance">
            The 9-Step Verification Workflow
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 text-balance">
            Every handover transitions through a strictly auditable state machine
            from initial setup to final sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => (
            <Card key={s.num} hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-extrabold text-zinc-200">
                  {s.num}
                </span>
                <Badge variant="zinc">{s.actor}</Badge>
              </div>
              <h4 className="text-sm font-semibold text-white">
                {s.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {s.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 3 Roles Section */}
      <div id="roles" className="pt-8 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Role Architecture &bull; Section 2
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1 text-balance">
            3 Product Roles & Contextual Ownership
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 text-balance">
            Outgoing and incoming are responsibilities on a specific handover, not permanent account restrictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <Card key={r.name} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-white">{r.name}</h3>
                  <Badge variant="zinc">{r.badge}</Badge>
                </div>
                <p className="text-xs text-zinc-400 mb-4">{r.desc}</p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {r.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-500 mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
