"use client"

/*
 * Purpose: Root layout error boundary. Renders its own html/body when the root layout itself fails.
 * Error tracking: replace/extend the console.error call with Sentry.captureException(error) once a Sentry DSN (NEXT_PUBLIC_SENTRY_DSN) is configured.
 */

import "styles/globals.css"
import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
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
    <html lang="en-IN">
      <body className="bg-cloud">
        <div
          role="alert"
          className="flex min-h-[60vh] items-center justify-center bg-cloud px-4 py-16"
        >
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-navy">Something went wrong</h1>
            <p className="mt-3 text-graphite">
              We hit an unexpected error loading this page. Please try again.
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
      </body>
    </html>
  )
}
