import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet, ScrollRestoration } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkAuthSession } from './store/authSlice.js'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AcceptInvitePage from './pages/AcceptInvitePage.jsx'

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
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/invite/accept',
        element: <AcceptInvitePage />,
      },

      // 2. Guest-only (bounced to /dashboard if already logged in)
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
        ],
      },

      // 3. Protected (bounced to /login if logged out)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
        ],
      },

      // Fallback
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
