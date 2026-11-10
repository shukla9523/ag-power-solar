/**
 * Purpose: sign out. Revokes the Supabase session (all refresh tokens) and clears cookies.
 */

import { NextRequest, NextResponse } from "next/server"
import { AUTH_COOKIE, revokeSupabaseSession, verifyAccessToken } from "@lib/auth/verify-token"
import { invalidateResolvedRole } from "@lib/auth/resolve-role"
import { verifyAdminOrigin } from "@lib/util/origin-check"

export async function POST(req: NextRequest) {
  if (!verifyAdminOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const accessToken = req.cookies.get(AUTH_COOKIE.access)?.value
  const identity = await verifyAccessToken(accessToken)
  await revokeSupabaseSession(accessToken)
  if (identity) invalidateResolvedRole(identity.userId)

  const response = NextResponse.json({ ok: true })
  response.cookies.delete(AUTH_COOKIE.access)
  response.cookies.delete(AUTH_COOKIE.refresh)
  return response
}
