/**
 * Purpose: email + password sign-in for the admin panel.
 * Issues a short-lived access token and a rotating refresh token as httpOnly cookies.
 * Rate limited (5 attempts / 10 min per IP+email) and returns generic errors so
 * account existence is never revealed.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAnon } from "@lib/supabase-admin"
import { resolveSession } from "@lib/auth/resolve-role"
import { AUTH_COOKIE, REFRESH_COOKIE_MAX_AGE, authCookieOptions } from "@lib/auth/verify-token"
import { canAccessAdmin } from "@lib/config/roles"
import { clientIp, rateLimit, resetRateLimit } from "@lib/util/rate-limit"
import { verifyAdminOrigin } from "@lib/util/origin-check"

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
})

// One message for a wrong password AND an account without access, so a response never
// confirms that a password was correct.
const GENERIC_ERROR = "Invalid email or password, or this account does not have admin access yet."

export async function POST(req: NextRequest) {
  if (!verifyAdminOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const parsed = LoginSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }
  const { email, password } = parsed.data

  const limiterKey = `login:${clientIp(req)}:${email}`
  const limit = rateLimit(limiterKey, 5, 10 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  try {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password })
    if (error || !data?.session || !data.user) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    const session = await resolveSession({
      userId: data.user.id,
      email: (data.user.email || email).toLowerCase(),
      expiresAt: Date.now() + data.session.expires_in * 1000,
      aal: "aal1",
    })

    if (!session || !canAccessAdmin(session.role)) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    resetRateLimit(limiterKey)

    // With 2FA on, these cookies are an aal1 session that only unlocks the code step.
    const response = NextResponse.json({ ok: true, role: session.role, mfaRequired: session.mfaEnabled })
    response.cookies.set(AUTH_COOKIE.access, data.session.access_token, authCookieOptions(data.session.expires_in))
    response.cookies.set(AUTH_COOKIE.refresh, data.session.refresh_token, authCookieOptions(REFRESH_COOKIE_MAX_AGE))
    response.cookies.delete("sb-role")
    return response
  } catch {
    return NextResponse.json({ error: "Sign-in is temporarily unavailable" }, { status: 500 })
  }
}
