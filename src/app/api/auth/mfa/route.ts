/**
 * Purpose: two-factor authentication (TOTP) for admin accounts.
 *
 * GET                       → { enabled, aal, required, pending }
 * POST { action: "enroll" }  → { factorId, qrCode, secret }  (scan with Google Authenticator / 1Password …)
 * POST { action: "verify", code, factorId? } → completes enrolment, or the login code step;
 *                              sets upgraded (aal2) session cookies
 * POST { action: "disable", code } → turns 2FA off (needs a fresh code; blocked when REQUIRE_ADMIN_MFA=true)
 *
 * Uses getUserSession (not requireSession) because this endpoint must work while the
 * 2FA step is still pending. Codes are rate limited: 5 attempts per 10 minutes.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getUserSession, invalidateUserSession } from "@lib/auth-helpers"
import { AUTH_COOKIE, REFRESH_COOKIE_MAX_AGE, authCookieOptions } from "@lib/auth/verify-token"
import { enrollTotp, listFactors, unenrollFactor, verifyTotp } from "@lib/auth/mfa"
import { canAccessAdmin } from "@lib/config/roles"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { notifyAdmins } from "@lib/services/notifications"
import { verifyAdminOrigin } from "@lib/util/origin-check"
import { rateLimit, resetRateLimit } from "@lib/util/rate-limit"

const BodySchema = z.object({
  action: z.enum(["enroll", "verify", "disable"]),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code").optional(),
  factorId: z.string().uuid().optional(),
})

async function setMfaFlag(userId: string, enabled: boolean): Promise<void> {
  const { error } = await supabaseAdmin.from("profiles").update({ mfa_enabled: enabled }).eq("id", userId)
  invalidateUserSession(userId)
  // If the mirror flag cannot be saved the login step could skip 2FA later, so stop here.
  if (error) throw new Error("Could not save the 2FA setting")
}

function withSession(body: Record<string, unknown>, session: { accessToken: string; refreshToken: string; expiresIn: number }) {
  const res = NextResponse.json(body)
  res.cookies.set(AUTH_COOKIE.access, session.accessToken, authCookieOptions(session.expiresIn))
  res.cookies.set(AUTH_COOKIE.refresh, session.refreshToken, authCookieOptions(REFRESH_COOKIE_MAX_AGE))
  return res
}

export async function GET(req: NextRequest) {
  const session = await getUserSession(req)
  if (!session || !canAccessAdmin(session.role)) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({
    enabled: session.mfaEnabled,
    aal: session.aal || "aal1",
    pending: Boolean(session.mfaPending),
    required: process.env.REQUIRE_ADMIN_MFA === "true" && (session.role === "owner" || session.role === "admin"),
  })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const session = await getUserSession(req)
  const accessToken = req.cookies.get(AUTH_COOKIE.access)?.value
  if (!session || !accessToken || !canAccessAdmin(session.role)) {
    return NextResponse.json({ error: "Please sign in again" }, { status: 401 })
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 })
  const { action, code, factorId } = parsed.data

  try {
    if (action === "enroll") {
      if (session.mfaEnabled) return NextResponse.json({ error: "2FA is already on for this account" }, { status: 409 })
      return NextResponse.json(await enrollTotp(accessToken, "Mommantum Admin"))
    }

    if (!code) return NextResponse.json({ error: "Enter the 6-digit code" }, { status: 400 })
    const limiterKey = `mfa:${session.userId}`
    if (!rateLimit(limiterKey, 5, 10 * 60 * 1000).allowed) {
      return NextResponse.json({ error: "Too many attempts. Wait 10 minutes and try again." }, { status: 429 })
    }

    const factors = await listFactors(accessToken)
    const verified = factors.filter((f) => f.status === "verified")

    if (action === "verify") {
      const target = factorId ? factors.find((f) => f.id === factorId) : verified[0]
      if (!target) return NextResponse.json({ error: "No authenticator is set up for this account" }, { status: 400 })

      const upgraded = await verifyTotp(accessToken, target.id, code)
      resetRateLimit(limiterKey)

      const firstTime = target.status === "unverified"
      if (firstTime || !session.mfaEnabled) {
        await setMfaFlag(session.userId, true)
        await recordAudit({ actor: session, action: "user.mfa_enabled", entityType: "user", entityKey: session.userId, before: { mfa_enabled: false }, after: { mfa_enabled: true } })
        await notifyAdmins({ type: "system", title: "2FA turned on", body: `${session.email} enabled two-factor authentication.`, link: "/admin/users" })
      }
      return withSession({ ok: true, enrolled: firstTime }, upgraded)
    }

    // action === "disable"
    if (process.env.REQUIRE_ADMIN_MFA === "true" && (session.role === "owner" || session.role === "admin")) {
      return NextResponse.json({ error: "2FA is required for owner and admin accounts" }, { status: 403 })
    }
    if (!verified.length) {
      await setMfaFlag(session.userId, false)
      return NextResponse.json({ ok: true })
    }
    // A fresh code proves possession and gives the aal2 session Supabase needs to remove factors.
    const upgraded = await verifyTotp(accessToken, verified[0].id, code)
    for (const factor of factors) await unenrollFactor(upgraded.accessToken, factor.id)
    await setMfaFlag(session.userId, false)
    resetRateLimit(limiterKey)
    await recordAudit({ actor: session, action: "user.mfa_disabled", entityType: "user", entityKey: session.userId, before: { mfa_enabled: true }, after: { mfa_enabled: false } })
    await notifyAdmins({ type: "system", title: "2FA turned off", body: `${session.email} disabled two-factor authentication.`, link: "/admin/audit", email: true })
    return withSession({ ok: true }, upgraded)
  } catch (err) {
    const message = err instanceof Error && /invalid|code|expired/i.test(err.message) ? "That code is not valid — try the latest one" : "2FA is temporarily unavailable"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
