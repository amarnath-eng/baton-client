import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_STATUS } from '../store/authSlice.js'
import { SessionLoader } from '../components/ui/SessionLoader.jsx'
import { ROUTES } from './paths.js'

export function PublicOnlyRoute() {
  const { isAuthenticated, status } = useSelector((state) => state.auth)

  // 1. While verifying session on startup, wait with branded loader
  if (status === AUTH_STATUS.LOADING || status === AUTH_STATUS.IDLE) {
    return <SessionLoader message="Checking Session" />
  }

  // 2. If already logged in, redirect away from login/register to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  // 3. Guest user: render login or register form
  return <Outlet />
}
