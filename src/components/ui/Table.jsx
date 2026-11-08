import React from 'react'
import { Shimmer } from './Shimmer.jsx'

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
          className={`w-full text-left text-xs min-w-full border-separate border-spacing-0 ${className}`}
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
      className={`py-3 px-4 text-[11px] text-zinc-400 uppercase tracking-wider font-semibold whitespace-nowrap border-b border-zinc-800/80 bg-zinc-900/95 ${className}`}
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
 * Modern Table Shimmer Skeleton Container
 */
export function TableLoading({ rows = 4, cols = 4 }) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 overflow-hidden shadow-sm">
      {/* Skeleton Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/30 px-4 py-3 flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer
            key={i}
            className={`h-3 ${
              i === 0 ? 'w-28' : i === cols - 1 ? 'w-20' : 'w-24'
            }`}
            rounded="rounded"
          />
        ))}
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-zinc-900/80">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="px-4 py-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Shimmer className="h-8 w-8 shrink-0" rounded="rounded-full" />
              <div className="space-y-1.5">
                <Shimmer className="h-3.5 w-32" rounded="rounded" />
                <Shimmer className="h-2.5 w-40" rounded="rounded" />
              </div>
            </div>

            <Shimmer className="h-3 w-20 hidden sm:block" rounded="rounded" />
            <Shimmer className="h-4 w-16 rounded-full hidden sm:block" />
            <Shimmer className="h-7 w-16 shrink-0" rounded="rounded-lg" />
          </div>
        ))}
      </div>
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
