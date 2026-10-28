import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from './paths.js'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { PublicOnlyRoute } from './PublicOnlyRoute.jsx'
import { RootLayout } from './RootLayout.jsx'
import WorkspaceLoadingScreen from '../components/feedback/WorkspaceLoadingScreen.jsx'

// Public Eager Routes (marketing & invites)
import LandingPage from '../pages/LandingPage.jsx'
import AcceptInvitePage from '../pages/AcceptInvitePage.jsx'

// Guest-Only Auth Pages
import RegisterPage from '../pages/RegisterPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx'

// Lazy-Loaded Authenticated Workspace Chunk (isolated for sub-1.5s bundle performance)
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'))

/**
 * Application Routing Tree
 * Configured with pathless security guards, lazy sub-routes, and fallback redirects
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1. Open to everyone (Public marketing)
      {
        path: ROUTES.HOME,
        element: <LandingPage />,
      },
      {
        path: ROUTES.ACCEPT_INVITE,
        element: <AcceptInvitePage />,
      },

      // 2. Guest-only (bounced to /dashboard if already logged in)
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: ROUTES.REGISTER,
            element: <RegisterPage />,
          },
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPasswordPage />,
          },
        ],
      },

      // 3. Protected Workspace (bounced to /login if unauthenticated)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <Navigate to={ROUTES.DASHBOARD_HANDOVERS} replace />,
          },
          {
            path: `${ROUTES.DASHBOARD}/*`,
            element: (
              <Suspense fallback={<WorkspaceLoadingScreen />}>
                <DashboardPage />
              </Suspense>
            ),
          },
        ],
      },

      // Fallback
      {
        path: '*',
        element: <Navigate to={ROUTES.HOME} replace />,
      },
    ],
  },
])
