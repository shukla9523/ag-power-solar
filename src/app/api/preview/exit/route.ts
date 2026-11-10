/**
 * Purpose: leave draft-preview mode and return to the public version of the page.
 */
import { NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"
import { PREVIEW_COOKIE } from "@lib/data/blog-preview"
import { safeReturnUrl } from "@lib/util/safe-redirect"

export async function GET(req: NextRequest) {
  ;(await draftMode()).disable()
  const res = NextResponse.redirect(safeReturnUrl(req.nextUrl.searchParams.get("to"), req.url))
  res.cookies.set(PREVIEW_COOKIE, "", { path: "/blog", maxAge: 0 })
  return res
}
