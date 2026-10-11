import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'

// Code-splitting: Separate bundles loaded on-demand
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))

// Minimal, elegant dark loading state
function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black text-lg animate-pulse">
          B
        </div>
        <div className="text-xs font-mono text-zinc-500">Loading continuity engine...</div>
      </div>
    </div>
  )
}

// Root layout that wraps all child routes with Suspense fallback for lazy-loaded bundles
function RootLayout() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Outlet />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
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
