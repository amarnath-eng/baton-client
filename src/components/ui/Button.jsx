// Reusable button component with modern monochrome and dark gray styles
export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
}) {
  const styles = {
    primary:
      'bg-white hover:bg-zinc-200 text-black font-semibold shadow-sm active:scale-98',
    secondary:
      'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 active:scale-98',
    outline:
      'bg-transparent hover:bg-zinc-900 text-zinc-300 border border-zinc-800 active:scale-98',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm active:scale-98',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm active:scale-98',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl',
  }

  const selectedStyle = styles[variant] || styles.primary
  const selectedSize = sizes[size] || sizes.md

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize} ${selectedStyle} ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
