import { NextRequest } from "next/server"

/**
 * Purpose: CSRF protection for state-changing admin requests.
 *
 * Why: the previous check trusted the request's own Host / X-Forwarded-Host headers,
 * which a client can influence. Origins are now compared against a server-side
 * allowlist: the production domains, NEXT_PUBLIC_BASE_URL, ALLOWED_ORIGINS (comma
 * separated) and the Vercel preview URL. Localhost is accepted only outside production.
 */

const PRODUCTION_HOSTS = ["www.agpower.in", "agpower.in", "ag-power-solar.vercel.app"]
const DEV_HOSTS = ["localhost:8000", "localhost:3000", "127.0.0.1:8000"]

function hostOf(value: string | undefined | null): string | null {
  if (!value) return null
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host.toLowerCase()
  } catch {
    return null
  }
}

export function getAllowedHosts(): string[] {
  const hosts = new Set<string>(PRODUCTION_HOSTS)
  const base = hostOf(process.env.NEXT_PUBLIC_BASE_URL)
  if (base) hosts.add(base)
  const vercel = hostOf(process.env.VERCEL_URL)
  if (vercel) hosts.add(vercel)
  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    const host = hostOf(entry.trim())
    if (host) hosts.add(host)
  }
  if (process.env.NODE_ENV !== "production") DEV_HOSTS.forEach((h) => hosts.add(h))
  return Array.from(hosts)
}

export function verifyAdminOrigin(req: NextRequest): boolean {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return true

  const source = req.headers.get("origin") || req.headers.get("referer")
  const host = hostOf(source)
  if (!host) {
    // Non-browser clients (curl, tests) are allowed only in local development.
    return process.env.NODE_ENV !== "production"
  }
  return getAllowedHosts().includes(host)
}
