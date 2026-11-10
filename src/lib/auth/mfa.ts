/**
 * Purpose: TOTP two-factor authentication using Supabase Auth MFA (GoTrue REST API).
 *
 * Factors are stored by Supabase Auth; `profiles.mfa_enabled` mirrors whether the user has a
 * verified factor so middleware can demand an aal2 session without an extra Auth call.
 * Every call uses the signed-in user's own access token (never the service role).
 */

import "server-only"

function authUrl(path: string): string {
  return `${(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")}/auth/v1${path}`
}

function headers(accessToken: string): Record<string, string> {
  return {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  }
}

export interface Factor {
  id: string
  factor_type: string
  status: "verified" | "unverified"
  friendly_name?: string
}

export interface MfaSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

async function call<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(authUrl(path), { ...init, headers: headers(accessToken), cache: "no-store" })
  const body = (await res.json().catch(() => ({}))) as T & { msg?: string; message?: string; error_description?: string }
  if (!res.ok) throw new Error(body.msg || body.message || body.error_description || `Auth error ${res.status}`)
  return body
}

export async function listFactors(accessToken: string): Promise<Factor[]> {
  const user = await call<{ factors?: Factor[] }>("/user", accessToken)
  return (user.factors || []).filter((f) => f.factor_type === "totp")
}

/** Starts enrolment: returns a QR code (SVG data URI) and the manual-entry secret. */
export async function enrollTotp(accessToken: string, label: string): Promise<{ factorId: string; qrCode: string; secret: string }> {
  // Remove abandoned, never-verified factors first so a retry always works.
  for (const factor of await listFactors(accessToken)) {
    if (factor.status === "unverified") {
      await call(`/factors/${factor.id}`, accessToken, { method: "DELETE" }).catch(() => undefined)
    }
  }
  const data = await call<{ id: string; totp: { qr_code: string; secret: string } }>("/factors", accessToken, {
    method: "POST",
    body: JSON.stringify({
      factor_type: "totp",
      friendly_name: `Mommantum admin ${new Date().toISOString().slice(0, 16)}`,
      issuer: label,
    }),
  })
  return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret }
}

/** Challenge + verify a 6-digit code; returns the upgraded (aal2) session. */
export async function verifyTotp(accessToken: string, factorId: string, code: string): Promise<MfaSession> {
  const challenge = await call<{ id: string }>(`/factors/${factorId}/challenge`, accessToken, { method: "POST", body: "{}" })
  const session = await call<{ access_token: string; refresh_token: string; expires_in: number }>(
    `/factors/${factorId}/verify`,
    accessToken,
    { method: "POST", body: JSON.stringify({ challenge_id: challenge.id, code }) }
  )
  return { accessToken: session.access_token, refreshToken: session.refresh_token, expiresIn: session.expires_in || 3600 }
}

/** Removes a factor (Supabase requires an aal2 session when a verified factor exists). */
export async function unenrollFactor(accessToken: string, factorId: string): Promise<void> {
  await call(`/factors/${factorId}`, accessToken, { method: "DELETE" })
}
