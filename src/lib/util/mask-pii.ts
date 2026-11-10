/**
 * Purpose: mask personal data (email, phone) for roles that only need lead context, not
 * contact details (marketers). Owner and admin see full values.
 */

/** "rahul.sharma@gmail.com" → "r***@gmail.com" */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return email ?? null
  const at = email.indexOf("@")
  if (at <= 0) return "***"
  return `${email[0]}***${email.slice(at)}`
}

/** "+91 98765 43210" → "•••••••10" (only the last two digits stay visible) */
export function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return phone ?? null
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 3) return "***"
  return `${"•".repeat(Math.max(3, digits.length - 2))}${digits.slice(-2)}`
}

export function maskLeadPii<T extends { email?: string | null; phone?: string | null }>(lead: T): T {
  return { ...lead, email: maskEmail(lead.email), phone: maskPhone(lead.phone) }
}
