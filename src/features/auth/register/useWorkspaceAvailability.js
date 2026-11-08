import { useRef, useEffect } from 'react'
import { checkWorkspaceApi } from '../../../services/companyApi.js'

/**
 * Single Responsibility: Manages debounced availability checking for company name and slug,
 * coordinating in-flight AbortControllers and status updates.
 */
export function useWorkspaceAvailability({ handleWorkspaceStatusChange }) {
  const availabilityTimerRef = useRef(null)
  const availabilityAbortControllerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (availabilityTimerRef.current) {
        clearTimeout(availabilityTimerRef.current)
      }
      if (availabilityAbortControllerRef.current) {
        availabilityAbortControllerRef.current.abort()
      }
    }
  }, [])

  const checkAvailability = (name, slug) => {
    if (availabilityTimerRef.current) {
      clearTimeout(availabilityTimerRef.current)
    }
    if (availabilityAbortControllerRef.current) {
      availabilityAbortControllerRef.current.abort()
    }

    const cleanName = (name || '').trim()
    const cleanSlug = (slug || '').trim().toLowerCase()

    if (cleanName.length < 2 && cleanSlug.length < 3) {
      handleWorkspaceStatusChange({
        isChecking: false,
        nameExists: false,
        nameCompany: null,
        slugExists: false,
        slugCompany: null,
      })
      return
    }

    availabilityTimerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      availabilityAbortControllerRef.current = controller

      try {
        handleWorkspaceStatusChange((prev) => ({ ...prev, isChecking: true }))
        const res = await checkWorkspaceApi(
          { name: cleanName, slug: cleanSlug },
          { signal: controller.signal }
        )

        if (!controller.signal.aborted) {
          handleWorkspaceStatusChange({
            isChecking: false,
            nameExists: Boolean(res?.name?.exists),
            nameCompany: res?.name?.exists
              ? { name: res.name.companyName, slug: res.name.slug }
              : null,
            slugExists: Boolean(res?.slug?.exists),
            slugCompany: res?.slug?.exists
              ? { name: res.slug.companyName, slug: res.slug.slug }
              : null,
          })
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        handleWorkspaceStatusChange({
          isChecking: false,
          nameExists: false,
          nameCompany: null,
          slugExists: false,
          slugCompany: null,
        })
      }
    }, 400)
  }

  return { checkAvailability }
}

