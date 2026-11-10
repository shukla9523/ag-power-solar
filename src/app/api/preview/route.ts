/**
 * Purpose: opens a draft / scheduled blog post from a signed preview link (draft mode for
 * this browser only, limited to this one post by a signed cookie). Invalid or expired links get a 401 and never reveal the post.
 */
import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"
import { PREVIEW_COOKIE, previewCookieValue, verifyPreview } from "@lib/data/blog-preview"

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const slug = p.get("slug") || ""
  const exp = p.get("exp") || ""
  const sig = p.get("sig") || ""
  if (!/^[a-z0-9-]{1,120}$/.test(slug) || !verifyPreview(slug, exp, sig)) {
    return new NextResponse("This preview link is invalid or has expired.", { status: 401 })
  }
  ;(await draftMode()).enable()
  const res = NextResponse.redirect(new URL(`/blog/${slug}`, req.url))
  res.headers.set("X-Robots-Tag", "noindex, nofollow")
  // Binds this browser's preview to this one post (checked on the blog page).
  res.cookies.set(PREVIEW_COOKIE, previewCookieValue(slug, exp, sig), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/blog",
    maxAge: Math.max(60, Number(exp) - Math.floor(Date.now() / 1000)),
  })
  return res
}
