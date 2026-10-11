import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('npm run dev')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const techStack = [
    {
      name: 'Vite',
      role: 'Next Gen Frontend Tooling',
      icon: '⚡',
      accent: 'from-amber-500/20 to-purple-500/20 border-amber-500/30 text-amber-400',
      badge: 'v8.3',
    },
    {
      name: 'React',
      role: 'Component Architecture',
      icon: '⚛️',
      accent: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
      badge: 'v19',
    },
    {
      name: 'Tailwind CSS',
      role: 'Styling & Utility Framework',
      icon: '🎨',
      accent: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-400',
      badge: 'v4.0',
    },
    {
      name: 'JavaScript',
      role: 'Vanilla Modern JS (ESM)',
      icon: '✨',
      accent: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
      badge: 'ESNext',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      {/* Background decorative glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-32 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 -z-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <main className="mx-auto max-w-5xl space-y-12">
        {/* Top Badges */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 shadow-sm shadow-cyan-950 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            Ready to Build &bull; React + Tailwind CSS v4
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Client Application
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400">
            A fast, modern React development environment built with Vite and powered by Tailwind CSS v4.
          </p>
        </header>

        {/* Interactive Playground / Counter Section */}
        <section aria-labelledby="interactive-card" className="mx-auto max-w-xl">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition hover:border-slate-700">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h2 id="interactive-card" className="text-lg font-semibold text-white">Interactive State Demo</h2>
                <p className="text-xs text-slate-400">Fast React hook updates with instant HMR</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
                count: {count}
              </span>
            </div>

            <div className="py-8 text-center space-y-4">
              <div className="text-5xl font-extrabold font-mono tracking-tight text-white">
                {count}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  id="decrement-btn"
                  onClick={() => setCount((c) => c - 1)}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition active:scale-95"
                >
                  - Decrement
                </button>
                <button
                  type="button"
                  id="reset-btn"
                  onClick={() => setCount(0)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition active:scale-95"
                >
                  Reset
                </button>
                <button
                  type="button"
                  id="increment-btn"
                  onClick={() => setCount((c) => c + 1)}
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
                >
                  + Increment
                </button>
              </div>
            </div>

            {/* Quick terminal helper */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/70 border border-slate-800/80 px-4 py-2.5 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">$</span> npm run dev
              </span>
              <button
                type="button"
                id="copy-command-btn"
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section aria-labelledby="features-heading" className="space-y-6">
          <h2 id="features-heading" className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Configured Stack & Features
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group relative rounded-xl border border-slate-800/90 bg-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{tech.icon}</div>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tech.accent}`}>
                    {tech.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {tech.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 text-center text-xs text-slate-500 border-t border-slate-900">
          Created with Vite & React &bull; Styled with Tailwind CSS v4 &bull; Path: <code className="text-slate-400">/client</code>
        </footer>
      </main>
    </div>
  )
}
