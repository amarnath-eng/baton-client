import { useState, useEffect, useRef } from 'react'
import { getCompanyMembersApi } from '../../../services/companyApi.js'
import { createHandoverApi } from '../../../services/handoverApi.js'

/**
 * Single Responsibility: Manages state, workspace members loading, validation,
 * and handover initialization submission logic.
 */
export function useCreateHandoverForm({ isOpen, onClose, onCreated }) {
  const [members, setMembers] = useState([])
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [reason, setReason] = useState('')
  const [deadline, setDeadline] = useState('')
  const [outgoingEngineerId, setOutgoingEngineerId] = useState('')
  const [incomingEngineerId, setIncomingEngineerId] = useState('')

  const [loadingMembers, setLoadingMembers] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const submitAbortControllerRef = useRef(null)

  // Clean up in-flight submission on unmount
  useEffect(() => {
    return () => {
      if (submitAbortControllerRef.current) {
        submitAbortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    setTitle('')
    setProject('')
    setReason('')
    setDeadline('')
    setOutgoingEngineerId('')
    setIncomingEngineerId('')
    setError(null)

    const controller = new AbortController()
    setLoadingMembers(true)

    async function loadMembers() {
      try {
        const data = await getCompanyMembersApi({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setMembers(data)
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        setError(err?.message || 'Failed to load workspace members.')
      } finally {
        if (!controller.signal.aborted) {
          setLoadingMembers(false)
        }
      }
    }

    loadMembers()

    return () => {
      controller.abort()
    }
  }, [isOpen])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !project.trim() || !reason.trim() || !deadline) {
      setError('Please fill in all required fields.')
      return
    }

    if (!outgoingEngineerId || !incomingEngineerId) {
      setError('Please assign both outgoing and incoming engineers.')
      return
    }

    if (outgoingEngineerId === incomingEngineerId) {
      setError('Outgoing and incoming engineers cannot be the same person.')
      return
    }

    if (submitAbortControllerRef.current) {
      submitAbortControllerRef.current.abort()
    }
    const controller = new AbortController()
    submitAbortControllerRef.current = controller

    setSubmitting(true)
    try {
      const response = await createHandoverApi(
        {
          title: title.trim(),
          project: project.trim(),
          reason: reason.trim(),
          deadline,
          outgoingEngineerId,
          incomingEngineerId,
        },
        { signal: controller.signal }
      )

      if (!controller.signal.aborted) {
        onCreated?.(response)
        onClose()
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return
      setError(err?.message || 'Failed to initialize handover.')
    } finally {
      if (!controller.signal.aborted) {
        setSubmitting(false)
      }
    }
  }

  return {
    members,
    title,
    setTitle,
    project,
    setProject,
    reason,
    setReason,
    deadline,
    setDeadline,
    outgoingEngineerId,
    setOutgoingEngineerId,
    incomingEngineerId,
    setIncomingEngineerId,
    loadingMembers,
    submitting,
    error,
    handleSubmit,
  }
}

