import { useState, useEffect, useCallback } from 'react'
import { getHandoversApi } from '../../../services/handoverApi.js'

export function useHandovers() {
  const [handovers, setHandovers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchHandovers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHandoversApi({
        status: statusFilter || undefined,
      })
      setHandovers(data)
    } catch (err) {
      setError(err?.message || 'Failed to fetch handovers.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchHandovers()
  }, [fetchHandovers])

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
