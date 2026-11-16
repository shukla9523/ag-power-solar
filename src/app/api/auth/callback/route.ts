/**
 * Purpose: Google sign-in (Supabase OAuth, PKCE) callback for the admin panel.
 *
 * - The owner (OWNER_EMAIL) is always approved.
 * - Any other new Google account gets a `customer` / `pending` profile (no admin access)
 *   and the owner is notified, so an admin can approve and assign a role.
 * - Approved admin-capable accounts receive httpOnly access + refresh cookies.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "@lib/supabase-admin"
import { resolveSession, invalidateResolvedRole } from "@lib/auth/resolve-role"
import { AUTH_COOKIE, REFRESH_COOKIE_MAX_AGE, authCookieOptions } from "@lib/auth/verify-token"
import { canAccessAdmin } from "@lib/config/roles"
import { isOwnerEmail } from "@lib/config/owner"
import { notifyAdmins } from "@lib/services/notifications"

function adminPath(): string {
  const raw = (process.env.CUSTOM_ADMIN_PATH || "admin").trim().toLowerCase()
  return /^[a-z0-9-]+$/.test(raw) ? raw : "admin"
}

function loginUrl(req: NextRequest, error: string): URL {
  const path = adminPath()
  const url = new URL(path === "admin" ? "/admin-login" : `/${path}-login`, req.url)
  url.searchParams.set("error", error)
  return url
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) return NextResponse.redirect(loginUrl(req, "Google sign-in was cancelled"))

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: {
          flowType: "pkce",
          persistSession: false,
          storage: {
            getItem: (key: string) => req.cookies.get(key)?.value || null,
            setItem: () => undefined,
            removeItem: () => undefined,
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.session || !data.user?.email) {
      return NextResponse.redirect(loginUrl(req, "Google sign-in failed. Please try again."))
    }

    const email = data.user.email.toLowerCase()
    const owner = isOwnerEmail(email)

    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, status, role")
        .eq("id", data.user.id)
        .maybeSingle()

      if (!profile) {
        await supabaseAdmin.from("profiles").insert({
          id: data.user.id,
          email,
          role: owner ? "owner" : "customer",
          status: owner ? "approved" : "pending",
        })
        if (!owner) {
          await notifyAdmins({
            type: "access_request",
            title: "New admin access request",
            body: `${email} signed in with Google and is waiting for approval.`,
            link: "/admin/users",
            email: true,
          })
        }
      } else if (owner && (profile.status !== "approved" || profile.role !== "owner")) {
        await supabaseAdmin.from("profiles").update({
          role: "owner",
          status: "approved",
        }).eq("id", data.user.id)
      }
    } catch {
      // Non-blocking: database table will be initialized or syncs on next run
    }

    if (owner) {
      invalidateResolvedRole(data.user.id)
    }

    const session = await resolveSession({
      userId: data.user.id,
      email,
      expiresAt: Date.now() + data.session.expires_in * 1000,
    })

    if (!session || !canAccessAdmin(session.role)) {
      return NextResponse.redirect(
        loginUrl(req, "Your access request is pending approval by an administrator.")
      )
    }

    const response = NextResponse.redirect(new URL(`/${adminPath()}`, req.url))
    response.cookies.set(AUTH_COOKIE.access, data.session.access_token, authCookieOptions(data.session.expires_in))
    response.cookies.set(AUTH_COOKIE.refresh, data.session.refresh_token, authCookieOptions(REFRESH_COOKIE_MAX_AGE))
    return response
  } catch {
    return NextResponse.redirect(loginUrl(req, "Sign-in is temporarily unavailable"))
  }
}
