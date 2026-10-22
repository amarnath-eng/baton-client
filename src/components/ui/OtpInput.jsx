import { useRef, useEffect } from 'react'

/**
 * Enterprise 6-Digit Segmented OTP Input
 * Features:
 * - Auto-advances focus on digit entry
 * - Auto-backs on Backspace
 * - Full clipboard paste support (auto-populates all 6 boxes)
 * - Auto-triggers onComplete callback when all 6 digits are filled
 * - Keyboard arrow navigation
 */
export function OtpInput({
  value = '',
  onChange,
  onComplete,
  onEnter,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) {
  const inputRefs = useRef([])

  // Split string into 6 slots
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus, disabled])

  const handleChange = (e, index) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    if (!rawVal) return

    // If typing single digit
    const digit = rawVal.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    const newValue = newDigits.join('').slice(0, 6)

    onChange?.(newValue)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newValue.length === 6) {
      onComplete?.(newValue)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current empty, back to previous and clear it
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        const newValue = newDigits.join('')
        onChange?.(newValue)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current
        const newDigits = [...digits]
        newDigits[index] = ''
        const newValue = newDigits.join('')
        onChange?.(newValue)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onEnter?.(value)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    if (disabled) return

    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasteData) return

    onChange?.(pasteData)

    // Focus appropriate box
    const nextIndex = Math.min(pasteData.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (pasteData.length === 6) {
      onComplete?.(pasteData)
    }
  }

  const renderBox = (index) => {
    const digit = digits[index]
    return (
      <input
        key={index}
        ref={(el) => (inputRefs.current[index] = el)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={digit}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        className={`w-10 sm:w-11 h-12 text-center text-lg font-mono font-bold rounded-xl transition-all outline-none ${
          hasError
            ? 'bg-rose-950/20 border border-rose-500/60 text-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
            : digit
            ? 'bg-zinc-900 border border-zinc-700 text-white shadow-inner focus:border-white focus:ring-2 focus:ring-white/20'
            : 'bg-zinc-950/70 border border-zinc-800 text-zinc-300 focus:bg-zinc-900 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text hover:border-zinc-700'}`}
      />
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 select-none" onPaste={handlePaste}>
      {/* First 3 Digits */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {[0, 1, 2].map((idx) => renderBox(idx))}
      </div>

      {/* Symmetrically Centered Separator */}
      <span className="flex items-center justify-center text-zinc-600 font-bold select-none text-base w-3 text-center">
        –
      </span>

      {/* Last 3 Digits */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {[3, 4, 5].map((idx) => renderBox(idx))}
      </div>
    </div>
  )
}
