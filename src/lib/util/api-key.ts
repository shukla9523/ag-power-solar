/**
 * Purpose: constant-time bearer-key checks for machine-to-machine endpoints
 * (external blog publisher, Vercel cron).
 *
 * Why: plain `===` comparison leaks timing information, and the publish API used to
 * share the admin secret. Each integration now has its own key.
 */

import { NextRequest } from "next/server"

/** Constant-time string comparison (runtime-agnostic, no early exit on mismatch). */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length
  const length = Math.max(a.length, b.length)
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

export function hasBearer(req: NextRequest, expected: string | undefined): boolean {
  if (!expected) return false
  const header = req.headers.get("authorization") || ""
  if (!header.startsWith("Bearer ")) return false
  return safeEqual(header.slice(7).trim(), expected)
}

/** External publisher (n8n / auto-blog engine). PUBLISH_API_KEY preferred; N8N_API_KEY kept for compatibility. */
export function isPublishRequest(req: NextRequest): boolean {
  return hasBearer(req, process.env.PUBLISH_API_KEY || process.env.N8N_API_KEY)
}

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export function isCronRequest(req: NextRequest): boolean {
  return hasBearer(req, process.env.CRON_SECRET)
}
