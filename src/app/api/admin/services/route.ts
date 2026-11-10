/**
 * Purpose: list (GET) and create (POST) services (admin, marketer).
 * POST is Zod-validated (ServiceCreateSchema) after camelCase keys are normalised; slug
 * collisions — including a race after the slugTaken check — return 409 SLUG_TAKEN.
 * Responses follow @lib/util/api-response; GET returns `{ success, data: Service[] }`.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { insertRow, pick } from "@lib/util/db-write"
import {
  OPTIONAL_CONTENT_COLUMNS,
  SERVICE_FIELDS,
  normalizeServiceBody,
  normalizeSlug,
  slugTaken,
  writeFailure,
} from "@lib/services/content-admin"
import { fail, forbidden, ok, okList, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { ServiceCreateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ROLES))) return forbidden()

    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) return serverError("Could not load services")
    return okList(data || [])
  } catch {
    return serverError("Could not load services")
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req, ROLES)
    if (!session) return forbidden()

    const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null
    const parsed = ServiceCreateSchema.safeParse(normalizeServiceBody(raw || {}))
    if (!parsed.success) return validationFail(parsed.error, "Invalid service")

    const slug = normalizeSlug(parsed.data.slug || parsed.data.title)
    if (!slug) return fail("Title is required", "VALIDATION_ERROR")
    if (await slugTaken("services", slug)) return slugTakenFail(slug)

    const payload = { points: [], outcomes: [], why_it_matters: [], faqs: [], image: "", ...pick(parsed.data, SERVICE_FIELDS), slug }
    const { data, error } = await insertRow("services", payload, OPTIONAL_CONTENT_COLUMNS)
    if (error) return writeFailure(error, slug, "Could not create the service")
    await recordAudit({ actor: session, action: "service.create", entityType: "service", entityKey: slug, before: null, after: data })
    await revalidateContent({ type: "service", slug })
    return ok({ ok: true, slug })
  } catch {
    return serverError("Could not create the service")
  }
}
