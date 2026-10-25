import React from 'react'

/**
 * Reusable minimal shimmer placeholder element.
 * Applies the sweeping light gradient animation over dark glass backgrounds.
 */
export function Shimmer({ className = '', rounded = 'rounded', ...props }) {
  return (
    <div
      className={`shimmer-bg ${rounded} ${className}`}
      {...props}
    />
  )
}

export default Shimmer
