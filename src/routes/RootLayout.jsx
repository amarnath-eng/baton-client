import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { checkAuthSession } from '../store/authSlice.js'

/**
 * Root Application Layout
 * Handles initial auth session verification and scroll restoration across route changes
 */
export function RootLayout() {
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
