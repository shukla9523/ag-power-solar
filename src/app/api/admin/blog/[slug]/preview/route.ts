/**
 * Purpose: creates a signed, 7-day preview link for a draft or scheduled post.
 */
import { NextRequest } from "next/server"
import { requireSession } from "@lib/auth-helpers"
import { createPreviewUrl } from "@lib/data/blog-preview"
import { fail, forbidden, ok } from "@lib/util/api-response"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireSession(req, ["admin", "marketer"]))) return forbidden()
  const slug = decodeURIComponent((await params).slug)
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return fail("Invalid slug", "VALIDATION_ERROR")
  try {
    const link = createPreviewUrl(slug)
    return ok({ url: new URL(link.url, req.url).toString(), expiresAt: link.expiresAt })
  } catch {
    return fail("Set PREVIEW_SECRET (or CRON_SECRET) to enable preview links", "UNAVAILABLE", 503)
  }
}
