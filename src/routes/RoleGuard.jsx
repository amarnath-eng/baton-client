import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from './paths.js'

/**
 * Route guard restricting access to specific user roles
 * @param {{ allowedRoles: string[], fallbackRoute?: string, children?: React.ReactNode }} props
 */
export function RoleGuard({ allowedRoles = [], fallbackRoute = ROUTES.DASHBOARD_HANDOVERS, children }) {
  const { role } = useSelector((state) => state.auth)

  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallbackRoute} replace />
  }

  return children ? children : <Outlet />
}
