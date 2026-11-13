/**
 * Purpose: single source of truth for the 4-role model (owner, admin, marketer, customer)
 * and which admin pages / admin APIs each role may reach.
 *
 * Edge-safe (no Node imports) so middleware, route handlers and the admin layout share it.
 * The frontend only uses it to hide navigation; every API re-checks on the server.
 */

export type AppRole = "owner" | "admin" | "marketer" | "customer"

export const APP_ROLES: AppRole[] = ["owner", "admin", "marketer", "customer"]

/** Roles that may be assigned through the admin UI (owner is never assignable). */
export const ASSIGNABLE_ROLES: AppRole[] = ["admin", "marketer", "customer"]

/** Higher number = more privilege. */
export const ROLE_RANK: Record<AppRole, number> = {
  customer: 0,
  marketer: 1,
  admin: 2,
  owner: 3,
}

/**
 * Maps legacy role values still present in the profiles table to the new model,
 * so the platform works before and after the role migration SQL is run.
 */
export function normalizeRole(raw: string | null | undefined): AppRole {
  const role = String(raw || "").trim().toLowerCase()
  switch (role) {
    case "owner":
      return "owner"
    case "admin":
      return "admin"
    case "marketer":
    case "manager":
    case "seo":
    case "content_manager":
    case "editor":
    case "viewer":
      return "marketer"
    default:
      return "customer"
  }
}

export interface RolePermission {
  allowedFrontendPaths: string[]
  allowedApiPaths: string[]
}

const MARKETING_FRONTEND = [
  "/admin",
  "/admin/blog",
  "/admin/services",
  "/admin/case-studies",
  "/admin/pages",
  "/admin/seo",
  "/admin/sitemap",
  "/admin/leads",
  "/admin/clients",
  "/admin/seo/report",
  "/admin/products",
  "/admin/security",
]

const MARKETING_API = [
  "/api/admin/stats",
  "/api/admin/blog",
  "/api/admin/services",
  "/api/admin/case-studies",
  "/api/admin/seo",
  "/api/admin/keywords",
  "/api/admin/custom",
  "/api/admin/jobs",
  "/api/admin/leads",
  "/api/admin/clients",
  "/api/admin/media",
  "/api/admin/notifications",
  "/api/admin/products",
]

export const rolesConfig: Record<AppRole, RolePermission> = {
  owner: { allowedFrontendPaths: ["*"], allowedApiPaths: ["*"] },
  admin: { allowedFrontendPaths: ["*"], allowedApiPaths: ["*"] },
  marketer: { allowedFrontendPaths: MARKETING_FRONTEND, allowedApiPaths: MARKETING_API },
  customer: { allowedFrontendPaths: [], allowedApiPaths: [] },
}

export function isPathAllowed(pathname: string, allowedPaths: string[]): boolean {
  if (allowedPaths.includes("*")) return true
  return allowedPaths.some((p) => {
    if (pathname === p) return true
    if (p === "/admin") return false // "/admin" must not wildcard-match every subpath
    return pathname.startsWith(p + "/")
  })
}

/** True when `role` is at least `minimum` in the hierarchy. */
export function hasRoleAtLeast(role: AppRole, minimum: AppRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum]
}

/** True when the role may open the admin panel at all. */
export function canAccessAdmin(role: AppRole): boolean {
  return hasRoleAtLeast(role, "marketer")
}
