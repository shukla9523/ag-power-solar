/**
 * Purpose: identifies the single platform owner account.
 *
 * The owner email is read from OWNER_EMAIL. DEFAULT_OWNER_EMAIL is the CEO account
 * confirmed on 2026-11-08 and is used only when the env variable is missing, so the
 * owner can never be locked out by a misconfigured deployment. Edge-safe.
 */

export const DEFAULT_OWNER_EMAIL = "akashshukla9523@gmail.com"

export function getOwnerEmail(): string {
  return (process.env.OWNER_EMAIL || DEFAULT_OWNER_EMAIL).trim().toLowerCase()
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === getOwnerEmail()
}
