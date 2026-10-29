/**
 * Single Source of Truth (SSOT) for Application Route Paths
 */
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ACCEPT_INVITE: '/invite/accept',

  // Dashboard & Workspaces
  DASHBOARD: '/dashboard',
  DASHBOARD_HANDOVERS: '/dashboard/handovers',
  DASHBOARD_HANDOVER_DETAIL: '/dashboard/handovers/:id',
  DASHBOARD_TEAM: '/dashboard/team',
  DASHBOARD_AUDIT: '/dashboard/audit',
})

/**
 * Route builders for dynamic parameters and query strings
 */
export const buildRoute = {
  loginWithWorkspace: (workspaceSlug) =>
    workspaceSlug
      ? `${ROUTES.LOGIN}?workspace=${encodeURIComponent(workspaceSlug)}`
      : ROUTES.LOGIN,

  handoverDetail: (id) => `${ROUTES.DASHBOARD_HANDOVERS}/${encodeURIComponent(id)}`,
}
