/**
 * Purpose: edge gate for the admin panel. Public routes pass straight through with zero
 * database work (decision D-11). Admin routes require a cryptographically verified
 * session, an approved account with an admin-capable role, and a path the role may open.
 * Expired access tokens are refreshed transparently using the httpOnly refresh cookie.
 */

import { NextRequest, NextResponse } from "next/server"
import { canAccessAdmin, isPathAllowed, rolesConfig } from "./lib/config/roles"
import {
  AUTH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
  RefreshedSession,
  authCookieOptions,
  refreshSupabaseSession,
  verifyAccessToken,
} from "./lib/auth/verify-token"
import { needsMfaEnrolment, needsMfaStep, resolveSession } from "./lib/auth/resolve-role"

const NOINDEX = "noindex, nofollow"

const PUBLIC_PREFIXES = [
  "/blog",
  "/work",
  "/services",
  "/editz",
  "/contact",
  "/about",
  "/faq",
  "/privacy-policy",
  "/terms-and-conditions",
]

const REMOVED_PATHS = ["/admin/schema", "/api/admin/schema"]

// Only real static file extensions bypass the gate (a bare "." check would let dotted admin URLs through).
const STATIC_FILE = /\.(?:png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|txt|xml|webmanifest|woff2?|css|js|map)$/i

const NOT_FOUND_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>404</title><style>body{background:#fff;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}.c{text-align:center;display:flex;flex-direction:column;gap:16px;align-items:center}h1{font-size:30px;font-weight:600;margin:0}p{font-size:14px;color:#6b7280;margin:0}a{font-size:14px;color:#3b82f6;text-decoration:none}</style></head><body><div class="c"><h1>Page not found</h1><p>The page you tried to access does not exist.</p><a href="/">Go to frontpage ↗</a></div></body></html>`

function notFound(): NextResponse {
  return new NextResponse(NOT_FOUND_HTML, {
    status: 404,
    headers: { "Content-Type": "text/html", "X-Robots-Tag": NOINDEX },
  })
}

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`))
}

function getCustomAdminPath(): string {
  const raw = (process.env.CUSTOM_ADMIN_PATH || "admin").trim().toLowerCase()
  return /^[a-z0-9-]+$/.test(raw) ? raw : "admin"
}

function withSessionCookies(response: NextResponse, refreshed: RefreshedSession | null): NextResponse {
  if (refreshed) {
    response.cookies.set(AUTH_COOKIE.access, refreshed.accessToken, authCookieOptions(refreshed.expiresIn))
    response.cookies.set(AUTH_COOKIE.refresh, refreshed.refreshToken, authCookieOptions(REFRESH_COOKIE_MAX_AGE))
  }
  response.headers.set("X-Robots-Tag", NOINDEX)
  return response
}

function getAdminLoginPath(): string {
  const custom = getCustomAdminPath()
  return custom === "admin" ? "/admin-login" : `/${custom}-login`
}

function redirectToLogin(request: NextRequest, error?: string): NextResponse {
  const url = new URL(getAdminLoginPath(), request.url)
  if (error) url.searchParams.set("error", error)
  const response = NextResponse.redirect(url)
  response.cookies.delete(AUTH_COOKIE.access)
  response.cookies.delete(AUTH_COOKIE.refresh)
  response.cookies.delete("sb-role")
  response.headers.set("X-Robots-Tag", NOINDEX)
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (REMOVED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return new NextResponse("Not Found", { status: 404 })
  }

  // Framework files, static assets, APIs (each API authorises itself) and sitemaps skip the gate.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/sitemap") ||
    STATIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  if (isPublicRoute(pathname)) return NextResponse.next()

  const customAdminPath = getCustomAdminPath()

  // When the admin path is disguised, the real /admin paths must look non-existent.
  if (customAdminPath !== "admin") {
    if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/admin-login") {
      return notFound()
    }
    if (pathname === `/${customAdminPath}-login`) {
      return withSessionCookies(NextResponse.rewrite(new URL(`/admin-login${request.nextUrl.search}`, request.url)), null)
    }
  }

  const isAdminRoute = pathname === `/${customAdminPath}` || pathname.startsWith(`/${customAdminPath}/`)
  if (!isAdminRoute) {
    if (pathname === "/admin-login") {
      const res = NextResponse.next()
      res.headers.set("X-Robots-Tag", NOINDEX)
      return res
    }
    return NextResponse.next()
  }

  const targetInternalPath = `/admin${pathname.substring(customAdminPath.length + 1) || ""}`

  try {
    let identity = await verifyAccessToken(request.cookies.get(AUTH_COOKIE.access)?.value)
    let refreshed: RefreshedSession | null = null

    if (!identity) {
      refreshed = await refreshSupabaseSession(request.cookies.get(AUTH_COOKIE.refresh)?.value)
      if (!refreshed) return redirectToLogin(request)
      identity = refreshed.user
    }

    const session = await resolveSession(identity)
    if (!session || !canAccessAdmin(session.role)) {
      return redirectToLogin(request, "Not authorized")
    }

    // 2FA: accounts with a factor must enter their code; REQUIRE_ADMIN_MFA forces enrolment.
    if (needsMfaStep(session, identity.aal)) {
      const url = new URL(getAdminLoginPath(), request.url)
      url.searchParams.set("mfa", "required")
      return withSessionCookies(NextResponse.redirect(url), refreshed)
    }
    if (needsMfaEnrolment(session) && targetInternalPath !== "/admin/security") {
      return withSessionCookies(NextResponse.redirect(new URL(`/${customAdminPath}/security?setup=required`, request.url)), refreshed)
    }

    if (!isPathAllowed(targetInternalPath, rolesConfig[session.role].allowedFrontendPaths)) {
      return withSessionCookies(
        NextResponse.redirect(new URL(`/${customAdminPath}?error=Unauthorized`, request.url)),
        refreshed
      )
    }

    if (customAdminPath === "admin") {
      return withSessionCookies(NextResponse.next(), refreshed)
    }
    return withSessionCookies(
      NextResponse.rewrite(new URL(targetInternalPath + request.nextUrl.search, request.url)),
      refreshed
    )
  } catch {
    return redirectToLogin(request, "Session verification failed")
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|assets).*)"],
}
