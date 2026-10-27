export default function WorkspaceLoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none relative overflow-hidden">
      {/* Subtle top ambient glowing sweep line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />

      {/* Background Radial Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* Centered Glowing Baton Logo */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Halo Glow */}
        <div className="absolute h-20 w-20 rounded-2xl bg-white/10 blur-xl animate-pulse" />
        {/* Baton Brand Monogram */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white font-black text-black text-2xl shadow-2xl relative z-10 transition-transform duration-300">
          B
        </div>
      </div>

      {/* Baton Brand Title & Tagline */}
      <div className="mt-5 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-base font-bold text-white tracking-tight">
            Baton
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            Continuity
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono">
          Engineering Workspace
        </p>
      </div>

      {/* Animated Loading Status with Smooth Progress Indicator */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Sleek indeterminate loader bar */}
        <div className="w-48 h-1 rounded-full bg-zinc-900 overflow-hidden relative border border-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent rounded-full animate-pulse"
            style={{
              animation: 'batonSlide 1.4s ease-in-out infinite',
            }}
          />
        </div>

        {/* Status text with pulsing indicator dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white/90" />
          </span>
          <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
            Loading Workspace...
          </span>
        </div>
      </div>

      {/* Inline animation keyframe for smooth slide */}
      <style>{`
        @keyframes batonSlide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
