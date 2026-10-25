import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_STATUS } from '../store/authSlice.js'
import { AuthCardSkeleton } from '../features/auth/components/AuthCardSkeleton.jsx'
import { useDeferredLoading } from '../hooks/useDeferredLoading.js'
import { ROUTES } from './paths.js'

export function PublicOnlyRoute() {
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const isCheckingSession = status === AUTH_STATUS.LOADING || status === AUTH_STATUS.IDLE
  const showSkeleton = useDeferredLoading(isCheckingSession, { delayMs: 150, minDurationMs: 300 })

  // 1. While verifying session: avoid skeleton flash if fast (< 150ms); shimmer if slow (> 150ms)
  if (isCheckingSession) {
    return showSkeleton ? <AuthCardSkeleton /> : <div className="min-h-screen bg-black" />
  }

  // 2. If already logged in, redirect away from login/register to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  // 3. Guest user: render login or register form
  return <Outlet />
}
