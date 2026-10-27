import { useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet, ScrollRestoration } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuthSession } from './store/authSlice.js'
import { ROUTES } from './routes/paths.js'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import AcceptInvitePage from './pages/AcceptInvitePage.jsx'

// Lazy-loaded Authenticated Workspace Chunk (separated from public/marketing bundle)
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
import WorkspaceLoadingScreen from './components/feedback/WorkspaceLoadingScreen.jsx'

// Root layout that renders active child route and restores scroll to top
function RootLayout() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuthSession())
  }, [dispatch])

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1. Open to everyone
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

      // 3. Protected (bounced to /login if logged out)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.DASHBOARD,
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

export default function App() {
  return <RouterProvider router={router} />
}
