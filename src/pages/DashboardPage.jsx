import { useLocation, useNavigate } from 'react-router-dom'
import DashboardNavbar from '../features/dashboard/DashboardNavbar.jsx'
import { ROUTES, DASHBOARD_ROUTES } from '../routes/paths.js'
import { RoleGuard } from '../routes/RoleGuard.jsx'
import { USER_ROLES } from '../constants/roles.js'

// Direct static imports bundled into the authenticated dashboard chunk
import HandoversPanel from '../features/handovers/HandoversPanel.jsx'
import TeamManagementPanel from '../features/invitations/TeamManagementPanel.jsx'
import AuditLogPanel from '../features/dashboard/AuditLogPanel.jsx'

// Clean dictionary mapping tabs to their panels (Zero nested ternaries!)
const TAB_COMPONENTS = {
  [DASHBOARD_ROUTES.HANDOVERS]: <HandoversPanel />,
  [DASHBOARD_ROUTES.TEAM]: (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
      <TeamManagementPanel />
    </RoleGuard>
  ),
  [DASHBOARD_ROUTES.AUDIT]: <AuditLogPanel />,
}

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Dynamically derive active tab from registered DASHBOARD_ROUTES
  const activeTab =
    Object.values(DASHBOARD_ROUTES).find((tab) =>
      location.pathname.startsWith(`${ROUTES.DASHBOARD}/${tab}`)
    ) || DASHBOARD_ROUTES.HANDOVERS

  // Dynamic single-line tab navigation
  const handleTabChange = (tab) => navigate(`${ROUTES.DASHBOARD}/${tab}`)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Workspace Body - 0ms instant switching from memory */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        {TAB_COMPONENTS[activeTab] || <HandoversPanel />}
      </main>
    </div>
  )
}
