import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardNavbar from '../features/dashboard/DashboardNavbar.jsx'
import { TeamManagementPanel } from '../features/invitations/index.js'
import { HandoversPanel } from '../features/handovers/index.js'

export default function DashboardPage() {
  const { user, company, role } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('handovers')
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Consistent Industry-Standard Navbar */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRequestsCount={pendingRequestsCount}
        onNewHandoverClick={() => console.log('New handover clicked')}
      />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Engineering continuity pipeline for <span className="text-white font-medium">{company?.name}</span>
          </p>
        </div>

        {activeTab === 'handovers' && (
          <HandoversPanel />
        )}

        {activeTab === 'team' && (
          <TeamManagementPanel
            onPendingRequestsChange={setPendingRequestsCount}
          />
        )}

        {activeTab === 'audit' && (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-white">Audit Log</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tamper-proof, append-only record of all handover state transitions and access reviews.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

