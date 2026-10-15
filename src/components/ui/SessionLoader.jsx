export function SessionLoader({ message = 'Verifying Session' }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none">
      {/* Subtle top loading line */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-400 to-transparent animate-pulse" />

      {/* Glowing Baton Monogram */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-2xl bg-white/10 blur-xl animate-pulse" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-extrabold text-black text-xl shadow-2xl relative z-10">
          B
        </div>
      </div>

      {/* Refined status indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
          {message}
        </span>
      </div>
    </div>
  )
}
