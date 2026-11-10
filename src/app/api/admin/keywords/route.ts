/**
 * Purpose: manual keyword → URL link rules (site_keywords). These override the automatic
 * keyword ownership taken from each page's primary/secondary keywords.
 * GET list · POST create · DELETE ?id=
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { fail, forbidden, ok, serverError, validationFail } from "@lib/util/api-response"
import { isUniqueViolation } from "@lib/util/db-write"

const ROLES = ["admin", "marketer"]

const RuleSchema = z.object({
  keyword: z.string().trim().min(3).max(80),
  target_url: z
    .string()
    .trim()
    .max(300)
    .regex(/^\/[a-z0-9/_-]*$|^https:\/\/(www\.)?mommantum\.com\/[a-z0-9/_-]*$/i, "Use an internal path such as /services/seo"),
  max_matches_per_page: z.number().int().min(1).max(3).optional(),
})

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ROLES))) {
    return forbidden()
  }
  const { data, error } = await supabaseAdmin.from("site_keywords").select("*").order("keyword", { ascending: true })
  if (error) return serverError("Could not load keywords")
  return ok({ keywords: data || [] })
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ROLES)
  if (!session) {
    return forbidden()
  }
  const parsed = RuleSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return validationFail(parsed.error, "Invalid keyword rule")
  }
  const { data, error } = await supabaseAdmin
    .from("site_keywords")
    .insert({ ...parsed.data, max_matches_per_page: parsed.data.max_matches_per_page || 1 })
    .select()
    .single()
  if (error) {
    return isUniqueViolation(error)
      ? fail("This keyword already has a rule", "CONFLICT", 409)
      : serverError("Could not save the keyword")
  }
  await recordAudit({ actor: session, action: "keyword.create", entityType: "keyword", entityKey: String(data?.id), before: null, after: data })
  await revalidateContent({ type: "blog" })
  await revalidateContent({ type: "service" })
  return ok({ keyword: data })
}

export async function DELETE(req: NextRequest) {
  const session = await requireSession(req, ROLES)
  if (!session) {
    return forbidden()
  }
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return fail("id is required")
  const { error } = await supabaseAdmin.from("site_keywords").delete().eq("id", id)
  if (error) return serverError("Could not delete the keyword")
  await recordAudit({ actor: session, action: "keyword.delete", entityType: "keyword", entityKey: id, before: { id }, after: null })
  await revalidateContent({ type: "blog" })
  await revalidateContent({ type: "service" })
  return ok({ ok: true })
}
