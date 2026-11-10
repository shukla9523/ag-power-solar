/**
 * Purpose: edit / delete a single case study (by id, or slug as a fallback).
 * Zod-validated (CaseStudyUpdateSchema), whitelisted fields, slug collision check
 * (409 SLUG_TAKEN, also on a unique-violation race), SEO meta object follows a rename.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { pick, updateRow } from "@lib/util/db-write"
import { CASE_STUDY_FIELDS, OPTIONAL_CONTENT_COLUMNS, moveSeoKey, normalizeSlug, slugTaken, writeFailure } from "@lib/services/content-admin"
import { fail, forbidden, notFound, ok, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { CaseStudyUpdateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]
type Params = { params: Promise<{ id: string }> }
type CaseStudyRow = Record<string, unknown> & { id: string | number; slug: string }

const UUID = /^[0-9a-f-]{36}$/i

async function findCaseStudy(identifier: string) {
  const column = UUID.test(identifier) || /^\d+$/.test(identifier) ? "id" : "slug"
  const { data } = await supabaseAdmin.from("case_studies").select("*").eq(column, identifier).maybeSingle()
  return data as CaseStudyRow | null
}

export async function GET(req: NextRequest, { params }: Params) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()
  const item = await findCaseStudy(decodeURIComponent((await params).id))
  if (!item) return notFound("Case study not found")
  return ok({ ...item })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ROLES)
  if (!session) return forbidden()
  const current = await findCaseStudy(decodeURIComponent((await params).id))
  if (!current) return notFound("Case study not found")

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return fail("Invalid body")
  const parsed = CaseStudyUpdateSchema.safeParse(body)
  if (!parsed.success) return validationFail(parsed.error, "Invalid case study")

  const update = pick(parsed.data, CASE_STUDY_FIELDS)
  if (update.slug !== undefined) {
    const slug = normalizeSlug(update.slug)
    if (!slug) return fail("Invalid slug", "VALIDATION_ERROR")
    if (slug !== current.slug && (await slugTaken("case_studies", slug))) return slugTakenFail(slug)
    update.slug = slug
  }

  const { data, error } = await updateRow("case_studies", { id: String(current.id) }, update, OPTIONAL_CONTENT_COLUMNS)
  if (error || !data) return writeFailure(error, String(update.slug || current.slug), "Could not save the case study")

  await recordAudit({ actor: session, action: "case_study.update", entityType: "case_study", entityKey: String(current.id), before: current, after: data as Record<string, unknown> })

  const newSlug = (update.slug as string) || current.slug
  await moveSeoKey("work", current.slug, newSlug)
  await revalidateContent({ type: "case-study", slug: newSlug, oldSlug: current.slug })
  await revalidateContent({ type: "seo", pageKey: `work:${newSlug}` })
  return ok({ ok: true, data })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["admin"])
  if (!session) return forbidden("Only admins can delete case studies")
  const current = await findCaseStudy(decodeURIComponent((await params).id))
  if (!current) return notFound("Case study not found")
  const { error } = await supabaseAdmin.from("case_studies").delete().eq("id", current.id)
  if (error) return serverError("Could not delete the case study")
  await recordAudit({ actor: session, action: "case_study.delete", entityType: "case_study", entityKey: String(current.id), before: current, after: null })
  await revalidateContent({ type: "case-study", slug: current.slug })
  return ok({ ok: true })
}
