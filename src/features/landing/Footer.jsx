import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black pt-12 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Bottom CTA Card */}
        <Card className="text-center p-8 sm:p-12 border-zinc-800/80 bg-[#0c0c0e]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            End handover anxiety. Start verifying continuity.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Give your engineering team a structured, reviewable, and auditable handover
            workflow that leaves zero orphan tasks behind.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/register">
              <Button variant="primary" className="text-xs sm:text-sm px-6 py-2.5 font-medium">
                Register Company Workspace
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-900 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">Baton</span>
            <span>&bull;</span>
            <span>Engineering Continuity SaaS</span>
          </div>

          <p className="text-zinc-400">
            Structured &bull; Reviewable &bull; Verifiable &bull; Server-Enforced
          </p>

          <p className="font-mono text-[11px] text-zinc-600">
            Day 1 Initialized &bull; 10-Day Plan
          </p>
        </div>
      </div>
    </footer>
  )
}
