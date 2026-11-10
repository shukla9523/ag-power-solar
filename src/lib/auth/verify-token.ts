/**
 * Purpose: cryptographically verify Supabase access tokens and refresh sessions.
 * Edge-safe (fetch + Web Crypto only) so middleware and Node route handlers share it.
 *
 * Why: the previous code only base64-decoded the JWT payload, so a forged token with
 * any user's `sub` was accepted. A token is now trusted only if (a) its HS256 signature
 * matches SUPABASE_JWT_SECRET, or (b) Supabase Auth itself confirms it via /auth/v1/user
 * (works for asymmetric signing keys too). Verified results are cached until the
 * token expires (max 5 minutes) so admin navigation stays fast.
 */

import { TtlCache, namedCache } from "@lib/util/ttl-cache"

export interface VerifiedToken {
  userId: string
  email: string
  expiresAt: number // epoch ms
  /** Supabase assurance level: "aal2" after a 2FA code was verified in this session. */
  aal?: string
  /** True when Supabase Auth reported a verified 2FA factor (only known on the remote check). */
  hasVerifiedFactor?: boolean
}

export interface RefreshedSession {
  accessToken: string
  refreshToken: string
  expiresIn: number // seconds
  user: VerifiedToken
}

const VERIFY_CACHE_TTL_MS = 5 * 60 * 1000
const verifiedCache: TtlCache<VerifiedToken> = namedCache<VerifiedToken>("verified-tokens", VERIFY_CACHE_TTL_MS, 1000)

function supabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
}

function anonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function decodeSegment<T>(segment: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment))) as T
  } catch {
    return null
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Local HS256 verification; returns null when the secret is not configured or the alg differs. */
async function verifyHs256(token: string, secret: string): Promise<boolean | null> {
  const [headerSeg, payloadSeg, signatureSeg] = token.split(".")
  const header = decodeSegment<{ alg?: string }>(headerSeg)
  if (!header || header.alg !== "HS256") return null

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )
  return crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signatureSeg) as BufferSource,
    new TextEncoder().encode(`${headerSeg}.${payloadSeg}`)
  )
}

/** Asks Supabase Auth to validate the token (authoritative, supports any signing key). */
async function verifyWithSupabase(token: string): Promise<{ id: string; email: string; hasVerifiedFactor: boolean } | null> {
  const url = supabaseUrl()
  const key = anonKey()
  if (!url || !key) return null

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  const user = (await res.json()) as { id?: string; email?: string; factors?: { status?: string }[] }
  if (!user?.id) return null
  const hasVerifiedFactor = Array.isArray(user.factors) && user.factors.some((f) => f?.status === "verified")
  return { id: user.id, email: user.email || "", hasVerifiedFactor }
}

/**
 * Returns the verified identity behind an access token, or null when the token is
 * forged, expired, revoked or malformed. Fails closed on any error.
 */
export async function verifyAccessToken(token: string | undefined | null): Promise<VerifiedToken | null> {
  if (!token || token.split(".").length !== 3) return null

  const cacheKey = await sha256Hex(token)
  const cached = verifiedCache.get(cacheKey)
  if (cached) {
    return cached.expiresAt > Date.now() ? cached : null
  }

  const payload = decodeSegment<{ sub?: string; email?: string; exp?: number; aal?: string }>(token.split(".")[1])
  if (!payload?.sub || !payload.exp) return null
  const expiresAt = payload.exp * 1000
  if (expiresAt <= Date.now()) return null

  try {
    let identity: { id: string; email: string; hasVerifiedFactor?: boolean } | null = null
    const secret = process.env.SUPABASE_JWT_SECRET
    const local = secret ? await verifyHs256(token, secret) : null

    if (local === true) {
      identity = { id: payload.sub, email: payload.email || "" }
    } else if (local === false) {
      return null // signature mismatch: forged token
    } else {
      identity = await verifyWithSupabase(token)
      if (identity && identity.id !== payload.sub) return null
    }

    if (!identity) return null

    const verified: VerifiedToken = {
      userId: identity.id,
      email: (identity.email || payload.email || "").toLowerCase(),
      expiresAt,
      aal: payload.aal || "aal1",
      hasVerifiedFactor: identity.hasVerifiedFactor,
    }
    verifiedCache.set(cacheKey, verified, Math.min(VERIFY_CACHE_TTL_MS, expiresAt - Date.now()))
    return verified
  } catch {
    return null
  }
}

/** Exchanges a refresh token for a new session (Supabase rotates the refresh token). */
export async function refreshSupabaseSession(refreshToken: string | undefined | null): Promise<RefreshedSession | null> {
  const url = supabaseUrl()
  const key = anonKey()
  if (!refreshToken || !url || !key) return null

  try {
    const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    })
    if (!res.ok) return null

    const data = (await res.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      user?: { id?: string; email?: string }
    }
    if (!data.access_token || !data.refresh_token || !data.user?.id) return null

    const expiresIn = data.expires_in || 3600
    const claims = decodeSegment<{ aal?: string }>(data.access_token.split(".")[1] || "")
    const user: VerifiedToken = {
      userId: data.user.id,
      email: (data.user.email || "").toLowerCase(),
      expiresAt: Date.now() + expiresIn * 1000,
      aal: claims?.aal || "aal1",
    }
    verifiedCache.set(await sha256Hex(data.access_token), user, Math.min(VERIFY_CACHE_TTL_MS, expiresIn * 1000))

    return { accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn, user }
  } catch {
    return null
  }
}

/** Revokes the session server-side (used on logout). */
export async function revokeSupabaseSession(accessToken: string | undefined | null): Promise<void> {
  const url = supabaseUrl()
  const key = anonKey()
  if (!accessToken || !url || !key) return
  try {
    await fetch(`${url}/auth/v1/logout?scope=global`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
  } catch {
    // Logout must still clear cookies even if revocation fails.
  }
  verifiedCache.delete(await sha256Hex(accessToken))
}

export const AUTH_COOKIE = {
  access: "sb-access-token",
  refresh: "sb-refresh-token",
} as const

export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  }
}

export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30
