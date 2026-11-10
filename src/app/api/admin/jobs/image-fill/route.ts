/**
 * Purpose: admin trigger for AI images on items that have no image.
 * GET  → list items currently missing images (no generation).
 * POST { pageKey?, limit? } → generate for missing items only (never replaces an image).
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { verifyUserRole } from "@lib/auth-helpers"
import { ImageFillService, findItemsMissingImages } from "@lib/services/image-fill-service"
import { fail, forbidden, ok } from "@lib/util/api-response"

export const maxDuration = 300

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const items = await findItemsMissingImages()
  return ok({ missing: items.map((i) => ({ pageKey: i.pageKey, title: i.title, kind: i.kind })) })
}

export async function POST(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const parsed = z
    .object({ pageKey: z.string().max(200).optional(), limit: z.number().int().min(1).max(25).optional() })
    .safeParse((await req.json().catch(() => ({}))) || {})
  if (!parsed.success) return fail("Invalid options")

  const result = await ImageFillService.run({ ...parsed.data, trigger: "admin" })
  // `success` is the request outcome; `complete` is false when some items failed.
  return ok({ complete: result.errors.length === 0, data: result })
}
