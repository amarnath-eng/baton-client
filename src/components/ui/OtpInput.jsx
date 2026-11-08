import { useState, useRef, useEffect } from 'react'

/**
 * Enterprise 6-Digit Segmented OTP Input
 * Features:
 * - Slot-isolated in-place editing (clearing or editing a digit never scrambles other slots)
 * - Auto-advances focus on digit entry
 * - In-place Backspace on filled slot; step-back Backspace on empty slot
 * - Full clipboard paste support (auto-populates all 6 boxes)
 * - Auto-triggers onComplete callback when all 6 digits are filled
 * - Keyboard arrow navigation and Delete key support
 */
export function OtpInput({
  value = '',
  onChange,
  onComplete,
  onEnter,
  disabled = false,
  hasError = false,
  autoFocus = true,
  compact = false,
}) {
  const inputRefs = useRef([])
  const prevValueRef = useRef(value)

  // Maintain 6 fixed slots so each digit is anchored to its position
  const [slots, setSlots] = useState(() => {
    const initial = Array.from({ length: 6 }, () => '')
    if (typeof value === 'string') {
      for (let i = 0; i < Math.min(value.length, 6); i++) {
        initial[i] = value[i]
      }
    }
    return initial
  })

  // Synchronize when value is cleared from parent (e.g. Resend) or set from external autofill
  useEffect(() => {
    if (value === '') {
      setSlots(['', '', '', '', '', ''])
    } else if (typeof value === 'string' && value.length === 6 && value !== slots.join('')) {
      setSlots(value.slice(0, 6).split(''))
    }
  }, [value])

  // Focus box 0 on initial mount if autoFocus is enabled
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Focus box 0 only when code is reset to empty from an existing value (e.g. Resend clicked)
  useEffect(() => {
    if (prevValueRef.current && value === '' && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
    prevValueRef.current = value
  }, [value, disabled])

  const notifyChange = (newSlots) => {
    setSlots(newSlots)
    const isComplete = newSlots.every((d) => d !== '')
    const joined = newSlots.join('')
    onChange?.(joined)
    if (isComplete) {
      onComplete?.(joined)
    }
  }

  const handleChange = (e, index) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    if (!rawVal) return

    // Pick latest typed digit
    const digit = rawVal.slice(-1)
    const newSlots = [...slots]
    newSlots[index] = digit
    notifyChange(newSlots)

    // Advance to next box
    if (digit && index < 5) {
      const nextEl = inputRefs.current[index + 1]
      if (nextEl) {
        nextEl.focus()
        const len = nextEl.value.length
        nextEl.setSelectionRange(len, len)
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newSlots = [...slots]

      if (slots[index]) {
        // Slot has a digit: clear ONLY this slot in-place (do NOT slide others)
        newSlots[index] = ''
        notifyChange(newSlots)
        // Keep focus right here with cursor blinking in the cleared box
      } else if (index > 0) {
        // Slot is already empty: step back to previous slot and clear it
        newSlots[index - 1] = ''
        notifyChange(newSlots)
        const prevEl = inputRefs.current[index - 1]
        if (prevEl) {
          prevEl.focus()
          prevEl.setSelectionRange(0, 0)
        }
      }
    } else if (e.key === 'Delete') {
      e.preventDefault()
      if (slots[index]) {
        const newSlots = [...slots]
        newSlots[index] = ''
        notifyChange(newSlots)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      const prevEl = inputRefs.current[index - 1]
      if (prevEl) {
        prevEl.focus()
        const len = prevEl.value.length
        prevEl.setSelectionRange(len, len)
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      const nextEl = inputRefs.current[index + 1]
      if (nextEl) {
        nextEl.focus()
        const len = nextEl.value.length
        nextEl.setSelectionRange(len, len)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onEnter?.(slots.join(''))
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    if (disabled) return

    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasteData) return

    const newSlots = Array.from({ length: 6 }, (_, i) => pasteData[i] || '')
    notifyChange(newSlots)

    const nextIndex = Math.min(pasteData.length, 5)
    const targetEl = inputRefs.current[nextIndex]
    if (targetEl) {
      targetEl.focus()
      const len = targetEl.value.length
      targetEl.setSelectionRange(len, len)
    }
  }

  const handleFocus = (e) => {
    const len = e.target.value.length
    requestAnimationFrame(() => {
      e.target.setSelectionRange(len, len)
    })
  }

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget || e.target.tagName !== 'INPUT') {
      const firstEmptyIndex = slots.findIndex((s) => !s)
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 5
      const el = inputRefs.current[targetIndex]
      if (el) {
        el.focus()
        const len = el.value.length
        el.setSelectionRange(len, len)
      }
    }
  }

  const renderBox = (index) => {
    const digit = slots[index] || ''
    return (
      <input
        key={index}
        ref={(el) => (inputRefs.current[index] = el)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        spellCheck={false}
        autoCorrect="off"
        value={digit}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onFocus={handleFocus}
        onClick={handleFocus}
        disabled={disabled}
        className={`${
          compact
            ? 'w-8.5 h-10 text-base font-mono font-semibold rounded-lg'
            : 'w-9 xs:w-10 sm:w-11 h-11 sm:h-12 text-center text-base sm:text-lg font-mono font-bold rounded-lg sm:rounded-xl'
        } text-center transition-all outline-none caret-white select-text ${
          hasError
            ? 'bg-rose-950/20 border border-rose-500/60 text-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20'
            : digit
            ? 'bg-zinc-900 border border-zinc-700 text-white shadow-inner focus:border-white focus:ring-2 focus:ring-white/20'
            : 'bg-zinc-950/70 border border-zinc-800 text-zinc-300 focus:bg-zinc-900 focus:border-white focus:ring-2 focus:ring-white/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text hover:border-zinc-700'}`}
      />
    )
  }

  return (
    <div
      onClick={handleContainerClick}
      className={`flex items-center justify-center ${compact ? 'gap-1.5' : 'gap-1.5 sm:gap-3'} select-none w-full`}
      onPaste={handlePaste}
    >
      {/* First 3 Digits */}
      <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1 xs:gap-1.5 sm:gap-2'}`}>
        {[0, 1, 2].map((idx) => renderBox(idx))}
      </div>

      {/* Symmetrically Centered Separator */}
      <span className={`flex items-center justify-center text-zinc-600 font-bold select-none ${compact ? 'text-sm w-2' : 'text-sm sm:text-base w-2 sm:w-3'} text-center shrink-0`}>
        –
      </span>

      {/* Last 3 Digits */}
      <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1 xs:gap-1.5 sm:gap-2'}`}>
        {[3, 4, 5].map((idx) => renderBox(idx))}
      </div>
    </div>
  )
}
