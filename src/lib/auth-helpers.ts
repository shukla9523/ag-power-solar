/**
 * Purpose: server-side session + permission checks for admin route handlers.
 *
 * Every admin API calls verifyUserRole / requireSession. Identity comes only from a
 * cryptographically verified access token (see lib/auth/verify-token.ts); the role comes
 * only from the database (see lib/auth/resolve-role.ts). Cookies or client state are
 * never trusted for roles.
 */

import { NextRequest } from "next/server"
import { cookies as nextCookies } from "next/headers"
import { AppRole, canAccessAdmin, hasRoleAtLeast, isPathAllowed, normalizeRole, rolesConfig } from "./config/roles"
import { verifyAdminOrigin } from "./util/origin-check"
import { AUTH_COOKIE, verifyAccessToken } from "./auth/verify-token"
import { ResolvedSession, invalidateResolvedRole, needsMfaEnrolment, needsMfaStep, resolveSession } from "./auth/resolve-role"

export type UserSession = ResolvedSession & {
  /** Assurance level of the current token ("aal2" once a 2FA code was verified). */
  aal?: string
  /** 2FA still has to be completed (code step or enrolment) before admin APIs are allowed. */
  mfaPending?: boolean
}

/**
 * Reads and verifies the session from the request cookies. Returns the session even while a
 * 2FA step is pending (the 2FA endpoints need it); requireSession blocks such sessions.
 */
export async function getUserSession(_req?: NextRequest): Promise<UserSession | null> {
  try {
    const cookieStore = await nextCookies()
    const identity = await verifyAccessToken(cookieStore.get(AUTH_COOKIE.access)?.value)
    if (!identity) return null
    const session = await resolveSession(identity)
    if (!session) return null
    return {
      ...session,
      aal: identity.aal,
      mfaPending: needsMfaStep(session, identity.aal) || needsMfaEnrolment(session),
    }
  } catch {
    return null
  }
}

/**
 * Converts the legacy role lists used by route handlers into the new model.
 * "admin" → admin; any marketing role (manager, seo, content_manager, editor, viewer,
 * marketer) → marketer. The owner is always allowed.
 */
function allowedRoleSet(allowedRoles: string[]): Set<AppRole> {
  const set = new Set<AppRole>(["owner"])
  for (const role of allowedRoles) {
    const normalized = role === "owner" ? "owner" : normalizeRole(role)
    if (normalized !== "customer") set.add(normalized)
  }
  return set
}

/**
 * Full gate for an admin API request: CSRF origin, verified session, role membership
 * and the role's API path allowlist. Returns the session, or null when denied.
 */
export async function requireSession(req: NextRequest, allowedRoles: string[]): Promise<UserSession | null> {
  if (!verifyAdminOrigin(req)) return null

  const session = await getUserSession(req)
  if (!session || !canAccessAdmin(session.role) || session.mfaPending) return null
  if (!allowedRoleSet(allowedRoles).has(session.role)) return null

  const config = rolesConfig[session.role]
  if (!isPathAllowed(req.nextUrl.pathname, config.allowedApiPaths)) return null

  return session
}

/** Boolean form kept for existing route handlers. */
export async function verifyUserRole(req: NextRequest, allowedRoles: string[]): Promise<boolean> {
  return (await requireSession(req, allowedRoles)) !== null
}

/** Minimum-role gate (owner > admin > marketer > customer). */
export async function requireMinRole(req: NextRequest, minimum: AppRole): Promise<UserSession | null> {
  if (!verifyAdminOrigin(req)) return null
  const session = await getUserSession(req)
  if (!session || session.mfaPending || !hasRoleAtLeast(session.role, minimum)) return null
  return session
}

/** Call after changing a user's role or status. */
export function invalidateUserSession(userId?: string): void {
  invalidateResolvedRole(userId)
}
