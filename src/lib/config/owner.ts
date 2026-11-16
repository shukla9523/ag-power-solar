/**
 * Purpose: identifies the single platform owner account.
 *
 * The owner email is read from OWNER_EMAIL. DEFAULT_OWNER_EMAIL is the CEO account
 * confirmed on 2026-11-08 and is used only when the env variable is missing, so the
 * owner can never be locked out by a misconfigured deployment. Edge-safe.
 */

export const DEFAULT_OWNER_EMAIL = "akashshukla9523@gmail.com"

export const OWNER_EMAILS = [
  "akashshukla9523@gmail.com",
  "nilesh.electroglobal@gmail.com",
]

export function getOwnerEmail(): string {
  return (process.env.OWNER_EMAIL || DEFAULT_OWNER_EMAIL).trim().toLowerCase()
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const norm = email.trim().toLowerCase()
  if (norm === getOwnerEmail()) return true
  return OWNER_EMAILS.includes(norm)
}
