import { AuthBrandingPanel, LoginForm } from '../features/auth/index.js'

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row">
      {/* Left 50% Showcase Panel (Desktop only) */}
      <AuthBrandingPanel />

      {/* Right 50% Interactive Form Panel (Desktop & Mobile) */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:py-16 min-h-screen">
        <LoginForm />
      </section>
    </main>
  )
}
