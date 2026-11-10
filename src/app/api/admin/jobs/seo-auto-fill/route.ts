/**
 * Purpose: run the AI meta fill on demand from the admin panel (empty fields only).
 * Body: { pageKey?: "service:seo", type?: "service" | "blog" | "case-study" | "static", limit?: number }
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { verifyUserRole } from "@lib/auth-helpers"
import { AiSeoService } from "@lib/services/ai-seo-service"
import { fail, forbidden, ok } from "@lib/util/api-response"

export const maxDuration = 60

const BodySchema = z.object({
  pageKey: z.string().trim().max(200).optional(),
  id: z.string().trim().max(200).optional(),
  type: z.enum(["static", "service", "blog", "case-study"]).optional(),
  limit: z.number().int().min(1).max(200).optional(),
})

export async function POST(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }

  const parsed = BodySchema.safeParse((await req.json().catch(() => ({}))) || {})
  if (!parsed.success) return fail("Invalid job options")

  const { pageKey, id, type, limit } = parsed.data
  const result = await AiSeoService.runAutoFillJob({ pageKey: pageKey || id, type, limit, trigger: "admin" })

  return ok({
    complete: result.errors.length === 0,
    message: `Filled empty fields on ${result.updatedCount} of ${result.processedCount} page(s).`,
    data: result,
  })
}
