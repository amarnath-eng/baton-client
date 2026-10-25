import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_STATUS } from '../store/authSlice.js'
import { DashboardSkeleton } from '../components/ui/DashboardSkeleton.jsx'
import { useDeferredLoading } from '../hooks/useDeferredLoading.js'
import { ROUTES } from './paths.js'

export function ProtectedRoute() {
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const isCheckingSession = status === AUTH_STATUS.LOADING || status === AUTH_STATUS.IDLE
  const showSkeleton = useDeferredLoading(isCheckingSession, { delayMs: 150, minDurationMs: 300 })

  // 1. While verifying session: avoid skeleton flash if fast (< 150ms); shimmer if slow (> 150ms)
  if (isCheckingSession) {
    return showSkeleton ? <DashboardSkeleton /> : <div className="min-h-screen bg-black" />
  }

  // 2. If unauthenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // 3. Authenticated: render the protected screen
  return <Outlet />
}
