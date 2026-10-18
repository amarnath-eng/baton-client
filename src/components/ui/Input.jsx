// Reusable dark monochrome input primitive with label, prefix, suffix, and error handling
export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  prefix,
  suffix,
  className = '',
  autoComplete = 'off',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-zinc-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div
        className={`flex items-center rounded-xl border bg-zinc-950 px-3.5 py-2.5 transition-colors duration-150 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 ${
          error ? 'border-rose-500/80' : 'border-zinc-800/80 hover:border-zinc-700'
        } ${className}`}
      >
        {prefix && (
          <span className="mr-1.5 select-none text-xs font-mono text-zinc-500 shrink-0">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
          {...props}
        />

        {suffix && (
          <div className="ml-1.5 shrink-0 text-zinc-400">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-zinc-500">{helperText}</p>}
    </div>
  )
}
