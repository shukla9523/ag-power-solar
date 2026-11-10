/**
 * Purpose: user-management rules, enforced on the server.
 *
 * - The owner (OWNER_EMAIL) can never be edited, demoted, suspended or deleted by anyone
 *   else. Only the owner can change the owner account, and deleting it requires typing
 *   the owner email plus the phrase DELETE OWNER ACCOUNT.
 * - Only owner and admin manage users. Nobody can assign the `owner` role.
 * - Admins cannot change other admins; only the owner can.
 */

import "server-only"
import { AppRole, ASSIGNABLE_ROLES, normalizeRole } from "@lib/config/roles"
import { isOwnerEmail } from "@lib/config/owner"
import type { UserSession } from "@lib/auth-helpers"

export const OWNER_DELETE_PHRASE = "DELETE OWNER ACCOUNT"

export type ProfileRow = { id: string; email: string; role: string; status: string }

export function isOwnerProfile(profile: Pick<ProfileRow, "email" | "role">): boolean {
  return isOwnerEmail(profile.email) || profile.role === "owner"
}

const KNOWN_ROLE_NAMES = ["owner", "admin", "marketer", "customer", "manager", "seo", "content_manager", "editor", "viewer"]

export function parseAssignableRole(value: unknown): AppRole | null {
  const role = typeof value === "string" ? value.trim().toLowerCase() : ""
  if (!KNOWN_ROLE_NAMES.includes(role) || role === "owner") return null
  const normalized = normalizeRole(role)
  return ASSIGNABLE_ROLES.includes(normalized) ? normalized : null
}

export const USER_STATUSES = ["approved", "pending", "rejected"] as const

export type Decision = { allowed: true } | { allowed: false; status: 403; error: string; code: string }

const deny = (error: string, code = "FORBIDDEN"): Decision => ({ allowed: false, status: 403, error, code })

/** May `actor` modify `target`? */
export function canModifyUser(actor: UserSession, target: ProfileRow): Decision {
  if (isOwnerProfile(target)) {
    return actor.isOwner && actor.userId === target.id
      ? { allowed: true }
      : deny("The owner account is protected and can only be changed by the owner.", "OWNER_PROTECTED")
  }
  if (actor.isOwner) return { allowed: true }
  if (actor.role !== "admin") return deny("Only admins can manage users.")
  if (normalizeRole(target.role) === "admin" && actor.userId !== target.id) {
    return deny("Only the owner can change another admin.")
  }
  return { allowed: true }
}

/** May `actor` give `role` to someone? */
export function canAssignRole(actor: UserSession, role: AppRole): Decision {
  if (role === "owner") return deny("The owner role cannot be assigned.", "OWNER_PROTECTED")
  if (role === "admin" && !actor.isOwner) return deny("Only the owner can create or promote admins.")
  return { allowed: true }
}
