/**
 * Purpose: edit / delete a single service by slug. Zod-validated (ServiceUpdateSchema),
 * whitelisted fields, slug collision check (409 SLUG_TAKEN, also on a unique-violation
 * race), SEO meta object follows a slug rename, old and new URLs are revalidated.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { pick, updateRow } from "@lib/util/db-write"
import {
  OPTIONAL_CONTENT_COLUMNS,
  SERVICE_FIELDS,
  moveSeoKey,
  normalizeServiceBody,
  normalizeSlug,
  slugTaken,
  writeFailure,
} from "@lib/services/content-admin"
import { fail, forbidden, notFound, ok, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { ServiceUpdateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]
type Params = { params: Promise<{ slug: string }> }
type ServiceRow = Record<string, unknown> & { slug: string }

async function findService(slug: string) {
  const { data } = await supabaseAdmin.from("services").select("*").eq("slug", slug).maybeSingle()
  return data as ServiceRow | null
}

export async function GET(req: NextRequest, { params }: Params) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()
  const service = await findService(decodeURIComponent((await params).slug))
  if (!service) return notFound("Service not found")
  return ok({ ...service })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ROLES)
  if (!session) return forbidden()
  const current = await findService(decodeURIComponent((await params).slug))
  if (!current) return notFound("Service not found")

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== "object") return fail("Invalid body")
  const parsed = ServiceUpdateSchema.safeParse(normalizeServiceBody(body))
  if (!parsed.success) return validationFail(parsed.error, "Invalid service")

  const update = pick(parsed.data, SERVICE_FIELDS)
  if (update.slug !== undefined) {
    const slug = normalizeSlug(update.slug)
    if (!slug) return fail("Invalid slug", "VALIDATION_ERROR")
    if (slug !== current.slug && (await slugTaken("services", slug))) return slugTakenFail(slug)
    update.slug = slug
  }

  const { data, error } = await updateRow("services", { slug: current.slug }, update, OPTIONAL_CONTENT_COLUMNS)
  if (error || !data) return writeFailure(error, String(update.slug || current.slug), "Could not save the service")

  await recordAudit({ actor: session, action: "service.update", entityType: "service", entityKey: String(data.slug), before: current, after: data as Record<string, unknown> })

  const newSlug = (update.slug as string) || current.slug
  await moveSeoKey("service", current.slug, newSlug)
  await revalidateContent({ type: "service", slug: newSlug, oldSlug: current.slug })
  await revalidateContent({ type: "seo", pageKey: `service:${newSlug}` })
  return ok({ ok: true, data })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["admin"])
  if (!session) return forbidden("Only admins can delete services")
  const slug = decodeURIComponent((await params).slug)
  const before = await findService(slug)
  const { error } = await supabaseAdmin.from("services").delete().eq("slug", slug)
  if (error) return serverError("Could not delete the service")
  await recordAudit({ actor: session, action: "service.delete", entityType: "service", entityKey: slug, before, after: null })
  await revalidateContent({ type: "service", slug })
  return ok({ ok: true })
}
