/**
 * Single Source of Truth (SSOT) for Application Route Paths
 */
const DASHBOARD_BASE = '/dashboard'

/**
 * Relative sub-route path segments for Dashboard tabs
 */
export const DASHBOARD_ROUTES = Object.freeze({
  HANDOVERS: 'handovers',
  TEAM: 'team',
  AUDIT: 'audit',
})

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ACCEPT_INVITE: '/invite/accept',

  // Dashboard & Sub-routes (Composed dynamically from DASHBOARD_ROUTES)
  DASHBOARD: DASHBOARD_BASE,
  DASHBOARD_HANDOVERS: `${DASHBOARD_BASE}/${DASHBOARD_ROUTES.HANDOVERS}`,
  DASHBOARD_HANDOVER_DETAIL: `${DASHBOARD_BASE}/${DASHBOARD_ROUTES.HANDOVERS}/:id`,
  DASHBOARD_TEAM: `${DASHBOARD_BASE}/${DASHBOARD_ROUTES.TEAM}`,
  DASHBOARD_AUDIT: `${DASHBOARD_BASE}/${DASHBOARD_ROUTES.AUDIT}`,
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
