import { AuthBrandingPanel } from './AuthBrandingPanel.jsx'

/**
 * Reusable 50/50 responsive split-screen layout for Authentication & Account flows.
 * Handles desktop showcase panel and mobile-resilient, top-weighted scrollable form container.
 */
export function AuthLayout({ children }) {
  return (
    <main className="min-h-screen min-h-dvh w-full bg-black text-white flex flex-col lg:flex-row">
      {/* Left 50% Showcase Panel (Desktop only) */}
      <AuthBrandingPanel />

      {/* Right 50% Interactive Form Panel (Desktop & Mobile) */}
      <section className="w-full lg:w-1/2 min-h-dvh flex flex-col justify-start lg:justify-center items-center px-6 pt-10 pb-32 sm:px-12 sm:pt-16 sm:pb-36 lg:py-16 overflow-y-auto">
        {children}
      </section>
    </main>
  )
}
