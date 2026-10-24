/**
 * Single Source of Truth (SSOT) for Application Route Paths
 */
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  ACCEPT_INVITE: '/invite/accept',

  // Handover detail & management routes
  HANDOVERS: '/handovers',
  HANDOVER_DETAIL: '/handovers/:id',
})

/**
 * Route builders for dynamic parameters and query strings
 */
export const buildRoute = {
  loginWithWorkspace: (workspaceSlug) =>
    workspaceSlug
      ? `${ROUTES.LOGIN}?workspace=${encodeURIComponent(workspaceSlug)}`
      : ROUTES.LOGIN,

  handoverDetail: (id) => `${ROUTES.HANDOVERS}/${encodeURIComponent(id)}`,
}
