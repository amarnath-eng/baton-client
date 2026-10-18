export function RolePreferenceSelector({ role, onChange }) {
  const roles = [
    {
      id: 'engineer',
      title: 'Engineer',
      desc: 'Create, manage & verify handovers.',
    },
    {
      id: 'manager',
      title: 'Manager',
      desc: 'Oversee team & approve handovers.',
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Full workspace & team access.',
    },
  ]

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-300">
        Role Preference <span className="text-rose-400">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              role === r.id
                ? 'bg-zinc-900 border-white text-white'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
            }`}
          >
            <div className="text-xs font-semibold text-white">{r.title}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{r.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
