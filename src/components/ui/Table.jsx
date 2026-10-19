import React from 'react'

/**
 * Modern, responsive Table container with dual-axis scrolling:
 * - Horizontal overflow (x-axis) when columns exceed container width
 * - Vertical overflow (y-axis) with sticky pinned header when rows exceed max height
 */
export function Table({
  children,
  className = '',
  containerClassName = '',
  maxHeight = 'max-h-[calc(100vh-280px)]',
  ...props
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm ${containerClassName}`}
    >
      <div
        className={`overflow-x-auto overflow-y-auto ${maxHeight} scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent`}
      >
        <table
          className={`w-full text-left text-xs min-w-full border-collapse ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

/**
 * Sticky Table Header: remains pinned at the top when scrolling down long lists
 */
export function TableHeader({ children, className = '', ...props }) {
  return (
    <thead
      className={`sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={`divide-y divide-zinc-800/50 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '', ...props }) {
  return (
    <tr
      className={`hover:bg-zinc-900/30 transition ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '', ...props }) {
  return (
    <th
      className={`py-3 px-4 text-[11px] text-zinc-400 uppercase tracking-wider font-semibold whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td
      className={`py-3.5 px-4 align-middle text-zinc-300 ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}

/**
 * Standard Loading State Container
 */
export function TableLoading({ message = 'Loading records...' }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-8 text-center text-xs text-zinc-500">
      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent mb-2" />
      <div>{message}</div>
    </div>
  )
}

/**
 * Standard Empty State Container
 */
export function TableEmpty({ title = 'No records found', description = '' }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-8 text-center space-y-1">
      <p className="text-xs font-medium text-zinc-300">{title}</p>
      {description && <p className="text-[11px] text-zinc-500">{description}</p>}
    </div>
  )
}
