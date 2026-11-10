"use client"

/*
 * Purpose: Public site pages error boundary. Renders inside the site header/footer layout.
 * Error tracking: replace/extend the console.error call with Sentry.captureException(error) once a Sentry DSN (NEXT_PUBLIC_SENTRY_DSN) is configured.
 */

import { useEffect } from "react"
import Link from "next/link"

export default function SiteError({
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
      className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-24"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-navy">This page couldn&apos;t load</h1>
        <p className="mt-3 text-graphite">
          Something went wrong on our side. Try again, or head back to the homepage.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-graphite">Reference: {error.digest}</p>
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
            href="/"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-navy hover:border-brand hover:text-brand transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
