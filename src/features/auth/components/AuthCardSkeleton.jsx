import React from 'react'
import { Shimmer } from '../../../components/ui/Shimmer.jsx'
import { AuthLayout } from './AuthLayout.jsx'

/**
 * Shimmer skeleton for Auth screens (Login, Register, Forgot Password)
 * rendered while Redux resolves auth state, eliminating spinners and splash loaders.
 */
export function AuthCardSkeleton() {
  return (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-6">
        {/* Title & subtitle shimmer */}
        <div className="space-y-2">
          <Shimmer className="h-6 w-44" rounded="rounded-md" />
          <Shimmer className="h-3.5 w-60" rounded="rounded" />
        </div>

        {/* Form fields shimmer */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-16" rounded="rounded" />
            <Shimmer className="h-10 w-full" rounded="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Shimmer className="h-3 w-20" rounded="rounded" />
            <Shimmer className="h-10 w-full" rounded="rounded-xl" />
          </div>

          {/* Action button shimmer */}
          <Shimmer className="h-10 w-full mt-2" rounded="rounded-xl" />
        </div>

        {/* Footer link shimmer */}
        <div className="flex justify-center pt-2">
          <Shimmer className="h-3 w-36" rounded="rounded" />
        </div>
      </div>
    </AuthLayout>
  )
}

export default AuthCardSkeleton
