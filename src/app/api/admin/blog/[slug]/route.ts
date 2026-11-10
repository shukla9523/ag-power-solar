/**
 * Purpose: edit / publish-toggle / delete a single blog post (identified by slug or id).
 * PUT and PATCH are Zod-validated (BlogUpdateSchema), accept only whitelisted fields,
 * sanitise HTML, reject slug collisions (409 SLUG_TAKEN, also on a unique-violation race)
 * and stale writes (409 when `updated_at` is sent and no longer matches).
 * DELETE is a soft delete (deleted_at) so posts can be restored.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { webpifyPost } from "@lib/services/webp-storage"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { pick, updateRow } from "@lib/util/db-write"
import { BLOG_FIELDS, cleanContentHtml, moveSeoKey, normalizeSlug, slugTaken, validateSchedule, writeFailure } from "@lib/services/content-admin"
import { fail, forbidden, notFound, ok, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { BlogUpdateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]
type Params = { params: Promise<{ slug: string }> }
type PostRow = Record<string, unknown> & { id: string; slug: string; status?: string; updated_at?: string | null; published_at?: string | null; publish_at?: string | null }

async function findPost(identifier: string) {
  const column = identifier.startsWith("post_") ? "id" : "slug"
  const { data } = await supabaseAdmin
    .from("post")
    .select("*")
    .eq(column, identifier)
    .is("deleted_at", null)
    .maybeSingle()
  return data as PostRow | null
}

async function save(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ROLES)
  if (!session) return forbidden()

  const identifier = decodeURIComponent((await params).slug)
  const current = await findPost(identifier)
  if (!current) return notFound("Post not found")

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return fail("Invalid body")
  const parsed = BlogUpdateSchema.safeParse(body)
  if (!parsed.success) return validationFail(parsed.error, "Invalid post")

  if (parsed.data.updated_at && current.updated_at && parsed.data.updated_at !== current.updated_at) {
    return fail("This post was changed by someone else. Reload and try again.", "STALE_UPDATE", 409)
  }

  const update = await webpifyPost(cleanContentHtml(pick(parsed.data, BLOG_FIELDS)))

  const scheduleError = validateSchedule(update.status, update.publish_at ?? current.publish_at)
  if (scheduleError) return fail(scheduleError, "VALIDATION_ERROR")
  if (update.status !== "scheduled" && update.status !== undefined) update.publish_at = null

  if (update.slug !== undefined) {
    const slug = normalizeSlug(update.slug)
    if (!slug) return fail("Invalid slug", "VALIDATION_ERROR")
    if (slug !== current.slug && (await slugTaken("post", slug, "id", current.id))) return slugTakenFail(slug)
    update.slug = slug
  }

  if (update.status === "published" && !current.published_at) {
    update.published_at = new Date().toISOString()
  }
  update.updated_at = new Date().toISOString()

  const { data, error } = await updateRow("post", { id: current.id }, update)
  if (error || !data) return writeFailure(error, String(update.slug || current.slug), "Could not save the post")

  await recordAudit({
    actor: session,
    action: update.status && update.status !== current.status ? `blog.${update.status}` : "blog.update",
    entityType: "post",
    entityKey: String(current.id),
    before: current,
    after: data as Record<string, unknown>,
  })

  const newSlug = (update.slug as string) || current.slug
  await moveSeoKey("blog", current.slug, newSlug)
  await revalidateContent({ type: "blog", slug: newSlug, oldSlug: current.slug })
  await revalidateContent({ type: "seo", pageKey: `blog:${newSlug}` })

  return ok({ ok: true, data })
}

export async function GET(req: NextRequest, { params }: Params) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()
  const post = await findPost(decodeURIComponent((await params).slug))
  if (!post) return notFound("Post not found")
  return ok({ ...post })
}

export const PUT = save
export const PATCH = save

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ROLES)
  if (!session) return forbidden()
  const current = await findPost(decodeURIComponent((await params).slug))
  if (!current) return notFound("Post not found")

  const { error } = await supabaseAdmin
    .from("post")
    .update({ deleted_at: new Date().toISOString(), status: "draft" })
    .eq("id", current.id)
  if (error) return serverError("Could not delete the post")
  await recordAudit({
    actor: session,
    action: "blog.delete",
    entityType: "post",
    entityKey: String(current.id),
    before: current,
    after: { ...current, deleted_at: new Date().toISOString(), status: "draft" },
  })

  await revalidateContent({ type: "blog", slug: current.slug })
  return ok({ ok: true })
}
