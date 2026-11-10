"use client"

/*
 * Purpose: Admin panel error boundary. Catches admin screen failures without exposing sensitive details.
 * Error tracking: replace/extend the console.error call with Sentry.captureException(error) once a Sentry DSN (NEXT_PUBLIC_SENTRY_DSN) is configured.
 */

import { useEffect } from "react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] items-center justify-center bg-admin-bg px-4 py-16 text-line-cool"
    >
      <div className="w-full max-w-md rounded-2xl border border-admin-line bg-admin-panel p-8 text-center shadow-2xl">
        <h1 className="text-xl font-bold text-white">Admin page error</h1>
        <p className="mt-3 text-sm text-line-cool/80">
          This admin screen failed to load. Try again, or return to the dashboard.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-line-cool/60">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="rounded-full border border-admin-line px-6 py-3 text-sm font-semibold text-line-cool hover:border-brand hover:text-white transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
