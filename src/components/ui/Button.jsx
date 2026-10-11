// Reusable button component with modern monochrome and dark gray styles
export function Button({
  children,
  type = 'button',
  variant = 'primary',
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
  }

  const selectedStyle = styles[variant] || styles.primary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedStyle} ${className}`}
    >
      {children}
    </button>
  )
}
