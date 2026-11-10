/**
 * Purpose: turn a verified identity into the platform role (owner/admin/marketer/customer).
 * Edge-safe: talks to PostgREST with fetch so middleware and route handlers share one rule.
 *
 * Why: role decisions must come from the database (never from cookies or the client),
 * and the owner is recognised from the verified email so the owner can never be locked
 * out or demoted by another account. Results are cached for 60 s per user.
 */

import { AppRole, normalizeRole } from "@lib/config/roles"
import { isOwnerEmail } from "@lib/config/owner"
import { namedCache } from "@lib/util/ttl-cache"
import type { VerifiedToken } from "./verify-token"

export interface ResolvedSession {
  userId: string
  email: string
  role: AppRole
  isOwner: boolean
  /** The account has a verified 2FA factor, so admin access needs an aal2 session. */
  mfaEnabled: boolean
}

const ROLE_CACHE_TTL_MS = 60 * 1000
const roleCache = namedCache<ResolvedSession | null>("resolved-roles", ROLE_CACHE_TTL_MS, 1000)

async function fetchProfile(userId: string): Promise<{ role?: string; status?: string; mfa_enabled?: boolean } | null> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url || !serviceKey) throw new Error("Supabase service credentials are not configured")

  const res = await fetch(
    `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    }
  )
  // Throwing (instead of returning null) keeps transient failures out of the cache.
  if (!res.ok) throw new Error(`Profile lookup failed with HTTP ${res.status}`)
  const rows = (await res.json()) as { role?: string; status?: string; mfa_enabled?: boolean }[]
  return rows[0] || null
}

/** Returns the session for a verified token, or null if the account may not sign in. */
export async function resolveSession(identity: VerifiedToken): Promise<ResolvedSession | null> {
  try {
    return await loadSession(identity)
  } catch {
    return null // fail closed
  }
}

function loadSession(identity: VerifiedToken): Promise<ResolvedSession | null> {
  return roleCache.getOrSet(identity.userId, async () => {
    if (isOwnerEmail(identity.email)) {
      // The owner never depends on the profile row for its role, but the row says whether 2FA
      // is on. If that lookup fails we must not skip 2FA, so the error propagates (fail closed,
      // and errors are never cached). A missing row simply means 2FA was never set up.
      const ownerProfile = await fetchProfile(identity.userId)
      return {
        userId: identity.userId,
        email: identity.email,
        role: "owner",
        isOwner: true,
        mfaEnabled: Boolean(ownerProfile?.mfa_enabled) || identity.hasVerifiedFactor === true,
      }
    }

    const profile = await fetchProfile(identity.userId)
    if (!profile || profile.status !== "approved") return null

    return {
      userId: identity.userId,
      email: identity.email,
      role: normalizeRole(profile.role),
      isOwner: false,
      mfaEnabled: Boolean(profile.mfa_enabled),
    }
  })
}

/** True when the admin panel must ask for a 2FA code before letting this session in. */
export function needsMfaStep(session: ResolvedSession, aal: string | undefined): boolean {
  return session.mfaEnabled && aal !== "aal2"
}

/** True when this account must set up 2FA first (REQUIRE_ADMIN_MFA=true, owner/admin only). */
export function needsMfaEnrolment(session: ResolvedSession): boolean {
  return process.env.REQUIRE_ADMIN_MFA === "true" && (session.role === "owner" || session.role === "admin") && !session.mfaEnabled
}

/** Drops cached roles after a role/status change so it applies on the next request. */
export function invalidateResolvedRole(userId?: string): void {
  if (userId) roleCache.delete(userId)
  else roleCache.clear()
}
