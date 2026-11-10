"use client"

/**
 * Purpose: warns before leaving an admin editor with unsaved changes (tab close, reload,
 * back button). Pass `dirty = true` while the form differs from what was loaded.
 */

import { useEffect } from "react"

export function useUnsavedGuard(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])
}
