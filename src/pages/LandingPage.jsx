import { Navbar } from '../features/landing/Navbar.jsx'
import { Hero } from '../features/landing/Hero.jsx'
import { ProblemComparison } from '../features/landing/ProblemComparison.jsx'
import { InteractiveWorkflowFlow } from '../features/landing/InteractiveWorkflowFlow.jsx'
import { Footer } from '../features/landing/Footer.jsx'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-zinc-100 font-['Inter',sans-serif] selection:bg-zinc-800 selection:text-white">
      {/* Subtle top ambient radial lighting */}
      <div className="pointer-events-none fixed top-0 left-1/2 -z-10 h-[450px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(255,255,255,0.06),rgba(0,0,0,0))]" />

      {/* Modern, Effortless Landing Flow */}
      <Navbar />
      <main>
        {/* 1. Clear & Effortless Hero */}
        <Hero />

        {/* 2. Why Baton: Existing Approach vs. Baton */}
        <ProblemComparison />

        {/* 3. How It Works: Interactive Clickable Flow */}
        <InteractiveWorkflowFlow />
      </main>

      {/* 4. Minimal Clean Footer */}
      <Footer />
    </div>
  )
}
