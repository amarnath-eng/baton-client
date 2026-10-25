import { useState, useEffect, useCallback, useRef } from 'react'
import { getHandoversApi } from '../../../services/handoverApi.js'
import { useWindowFocus } from '../../../hooks/useWindowFocus.js'

export function useHandovers() {
  const [handovers, setHandovers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const abortControllerRef = useRef(null)

  const fetchHandovers = useCallback(async () => {
    // 1. Terminate previous in-flight request if user quickly switched filters
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const data = await getHandoversApi(
        { status: statusFilter || undefined },
        { signal: controller.signal }
      )
      if (!controller.signal.aborted) {
        setHandovers(data)
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return
      }
      setError(err?.message || 'Failed to fetch handovers.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [statusFilter])

  useEffect(() => {
    fetchHandovers()
    return () => {
      // Clean up in-flight request on unmount to prevent React memory leaks
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchHandovers])

  // Revalidate fresh handovers when returning to browser window
  useWindowFocus(fetchHandovers)

  return {
    handovers,
    loading,
    error,
    setError,
    statusFilter,
    setStatusFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    refetch: fetchHandovers,
  }
}
