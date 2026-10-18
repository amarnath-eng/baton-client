import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardBrand from './DashboardBrand.jsx'
import DashboardNavTabs from './DashboardNavTabs.jsx'
import DashboardUserMenu from './DashboardUserMenu.jsx'

export default function DashboardNavbar({
  activeTab = 'handovers',
  onTabChange,
  pendingRequestsCount = 0,
}) {
  const { role } = useSelector((state) => state.auth)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const isPrivileged = role === 'admin' || role === 'manager'

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-2xl">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] h-14 sm:h-16 max-w-7xl items-center px-3 sm:px-4">
        {/* Column 1: Brand & Breadcrumb */}
        <DashboardBrand
          isOverflowing={isOverflowing}
          onOverflowChange={setIsOverflowing}
        />

        {/* Column 2: Segmented Capsule Navigation Tabs (Desktop) */}
        <DashboardNavTabs
          variant="desktop"
          activeTab={activeTab}
          onTabChange={onTabChange}
          pendingRequestsCount={pendingRequestsCount}
          isPrivileged={isPrivileged}
        />

        {/* Column 3: User Avatar & Context Menu */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <DashboardUserMenu isOverflowing={isOverflowing} />
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <DashboardNavTabs
        variant="mobile"
        activeTab={activeTab}
        onTabChange={onTabChange}
        pendingRequestsCount={pendingRequestsCount}
        isPrivileged={isPrivileged}
      />
    </header>
  )
}
