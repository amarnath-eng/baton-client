import { useState, useRef, useEffect } from 'react'

/**
 * Modern 2026 Sleek Select Dropdown Component
 *
 * @param {Object} props
 * @param {string|number} props.value - Currently selected value
 * @param {(value: string) => void} props.onChange - Selection callback
 * @param {Array<{ label: string, value: string, badge?: string|number, dotColor?: string }>} props.options
 * @param {string} [props.placeholder='Select option']
 * @param {string} [props.className='']
 * @param {'left'|'right'} [props.align='left']
 * @param {string} [props.prefix='']
 */
export default function SelectDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  align = 'left',
  prefix = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
          isOpen
            ? 'border-zinc-700 bg-zinc-800/90 text-white ring-2 ring-white/10'
            : 'border-zinc-800/90 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-white'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption?.icon ? (
            <span className="shrink-0">{selectedOption.icon}</span>
          ) : selectedOption?.dotColor ? (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dotColor}`}
            />
          ) : null}
          {prefix && <span className="text-zinc-500 font-normal">{prefix}</span>}
          <span className="truncate max-w-[140px] sm:max-w-[180px] font-medium text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {/* Animated Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute mt-1.5 min-w-[160px] sm:min-w-[220px] rounded-xl border border-zinc-800/90 bg-[#121215]/95 backdrop-blur-xl shadow-2xl shadow-black/80 z-50 p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {option.icon ? (
                    <span className="shrink-0">{option.icon}</span>
                  ) : option.dotColor ? (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${option.dotColor}`}
                    />
                  ) : null}
                  <span className="truncate">
                    {option.label}
                  </span>
                </div>

                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
