import { AuthBrandingPanel, RegisterForm } from '../features/auth/index.js'

// Dedicated Register Page with 50/50 responsive split screen
export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row">
      {/* Left 50% Showcase Panel (Desktop only) */}
      <AuthBrandingPanel />

      {/* Right 50% Interactive Form Panel (Desktop & Mobile) */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:py-16 min-h-screen">
        <RegisterForm />
      </section>
    </main>
  )
}
