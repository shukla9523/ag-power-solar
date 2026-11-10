/**
 * Purpose: list (GET) and create (POST) case studies (admin, marketer).
 * POST is Zod-validated (CaseStudyCreateSchema); slug collisions — including a race after
 * the slugTaken check — return 409 SLUG_TAKEN.
 * Responses follow @lib/util/api-response; GET returns `{ success, data: CaseStudy[] }`.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { insertRow, pick } from "@lib/util/db-write"
import { CASE_STUDY_FIELDS, OPTIONAL_CONTENT_COLUMNS, normalizeSlug, slugTaken, writeFailure } from "@lib/services/content-admin"
import { fail, forbidden, ok, okList, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { CaseStudyCreateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]

// GET /api/admin/case-studies - List case studies
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ROLES))) return forbidden()

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) return serverError("Could not load case studies")
    return okList(data || [])
  } catch {
    return serverError("Could not load case studies")
  }
}

// POST /api/admin/case-studies - Create case study
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req, ROLES)
    if (!session) return forbidden()

    const parsed = CaseStudyCreateSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return validationFail(parsed.error, "Invalid case study")

    const slug = normalizeSlug(parsed.data.slug || parsed.data.title)
    if (!slug) return fail("Title and slug are required", "VALIDATION_ERROR")
    if (await slugTaken("case_studies", slug)) return slugTakenFail(slug)

    const payload = {
      what_we_did: [],
      results: [],
      metrics: [],
      accent: "#e61e73",
      ...pick(parsed.data, CASE_STUDY_FIELDS),
      slug,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await insertRow("case_studies", payload, OPTIONAL_CONTENT_COLUMNS)
    if (error) return writeFailure(error, slug, "Could not create the case study")
    await recordAudit({ actor: session, action: "case_study.create", entityType: "case_study", entityKey: String(data?.id), before: null, after: data })
    await revalidateContent({ type: "case-study", slug })
    return ok({ ok: true, data })
  } catch {
    return serverError("Could not create the case study")
  }
}
