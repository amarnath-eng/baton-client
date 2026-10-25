import { useState } from 'react'
import DashboardNavbar from '../features/dashboard/DashboardNavbar.jsx'
import { TeamManagementPanel } from '../features/invitations/index.js'
import { HandoversPanel } from '../features/handovers/index.js'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('handovers')

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Consistent Industry-Standard Navbar */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        {activeTab === 'handovers' && (
          <HandoversPanel />
        )}

        {activeTab === 'team' && (
          <TeamManagementPanel />
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
