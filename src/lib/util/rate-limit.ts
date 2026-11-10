/**
 * Purpose: fixed-window rate limiting backed by the in-process TTL cache (no Redis).
 *
 * Why: login and the public contact form need brute-force / spam protection. Limits
 * are per warm instance, which is enough to stop scripted abuse on Vercel; the
 * contact form adds Turnstile for distributed attacks.
 */

import { NextRequest } from "next/server"
import { namedCache } from "./ttl-cache"

type Bucket = { count: number; resetAt: number }

const buckets = namedCache<Bucket>("rate-limit", 60 * 60 * 1000, 5000)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)
  const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs }
  bucket.count += 1
  buckets.set(key, bucket, bucket.resetAt - now)
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export function resetRateLimit(key: string): void {
  buckets.delete(key)
}

/** Best-effort client IP (Vercel sets x-forwarded-for / x-real-ip). */
export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") || "unknown"
}

// Without IP_HASH_SALT a random per-instance salt is used: hashes then cannot be linked
// across instances, which is the privacy-safe failure (no shared or guessable salt).
const FALLBACK_SALT = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("")

/** Salted SHA-256 of the IP so raw IPs are never stored or logged (DPDP). */
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT || FALLBACK_SALT
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
