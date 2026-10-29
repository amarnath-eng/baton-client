import { useLocation, useNavigate } from 'react-router-dom'
import DashboardNavbar from '../features/dashboard/DashboardNavbar.jsx'
import { ROUTES } from '../routes/paths.js'
import { RoleGuard } from '../routes/RoleGuard.jsx'
import { USER_ROLES } from '../constants/roles.js'

// Direct static imports bundled into the authenticated dashboard chunk
import HandoversPanel from '../features/handovers/HandoversPanel.jsx'
import TeamManagementPanel from '../features/invitations/TeamManagementPanel.jsx'
import AuditLogPanel from '../features/dashboard/AuditLogPanel.jsx'

// Clean dictionary mapping routes to their panels (Zero nested ternaries!)
const TAB_COMPONENTS = {
  [ROUTES.DASHBOARD_HANDOVERS]: <HandoversPanel />,
  [ROUTES.DASHBOARD_TEAM]: (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
      <TeamManagementPanel />
    </RoleGuard>
  ),
  [ROUTES.DASHBOARD_AUDIT]: <AuditLogPanel />,
}

const DASHBOARD_TABS = [
  ROUTES.DASHBOARD_HANDOVERS,
  ROUTES.DASHBOARD_TEAM,
  ROUTES.DASHBOARD_AUDIT,
]

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Dynamically derive active tab from registered tab routes
  const activeTab =
    DASHBOARD_TABS.find((tabRoute) => location.pathname.startsWith(tabRoute)) ||
    ROUTES.DASHBOARD_HANDOVERS

  // Direct route navigation
  const handleTabChange = (tabRoute) => navigate(tabRoute)

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
