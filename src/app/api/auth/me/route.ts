/**
 * Purpose: tells the admin UI who is signed in and what it may show.
 * The UI only uses this to hide navigation; every API re-checks permissions.
 */

import { NextResponse } from "next/server"
import { getUserSession } from "@lib/auth-helpers"
import { rolesConfig } from "@lib/config/roles"
import { getOwnerEmail } from "@lib/config/owner"

export async function GET() {
  const session = await getUserSession()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json({
    ok: true,
    email: session.email,
    role: session.role,
    isOwner: session.isOwner,
    mfaEnabled: session.mfaEnabled,
    mfaPending: Boolean(session.mfaPending),
    ownerEmail: getOwnerEmail(),
    allowedFrontendPaths: rolesConfig[session.role].allowedFrontendPaths,
    customAdminPath: process.env.CUSTOM_ADMIN_PATH || "admin",
  })
}
