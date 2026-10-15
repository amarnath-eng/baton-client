import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_STATUS } from '../store/authSlice.js'
import { SessionLoader } from '../components/ui/SessionLoader.jsx'

export function ProtectedRoute() {
  const { isAuthenticated, status } = useSelector((state) => state.auth)

  // 1. While verifying session on startup, wait with branded loader
  if (status === AUTH_STATUS.LOADING || status === AUTH_STATUS.IDLE) {
    return <SessionLoader message="Verifying Session" />
  }

  // 2. If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 3. Authenticated: render the protected screen
  return <Outlet />
}
