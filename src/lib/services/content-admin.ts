/**
 * Purpose: shared rules for admin content writes (blog posts, services, case studies):
 * field whitelists, HTML sanitising, slug uniqueness, slug-rename side effects
 * (move the page's meta object, revalidate old + new URLs), and mapping write errors to
 * API responses (unique violation → 409 SLUG_TAKEN, review item C8).
 * Zod schemas for the request bodies live in @lib/validation/admin (review item C4).
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { sanitizeRichHtml } from "@lib/util/sanitize"
import { toSlug } from "@lib/util/slug"
import { recordRedirect } from "@lib/seo/redirects"
import { isUniqueViolation } from "@lib/util/db-write"
import { serverError, slugTakenFail } from "@lib/util/api-response"
import { POST_STATUSES } from "@lib/validation/admin"

export { POST_STATUSES }

export const BLOG_FIELDS = [
  "title", "slug", "category_id", "featured_image", "image_urls", "excerpt", "content",
  "author_name", "meta_title", "meta_description", "status", "faqs", "publish_at",
] as const

/** Validates status + publish_at together; returns an error message or null. */
export function validateSchedule(status: unknown, publishAt: unknown): string | null {
  if (status === undefined) return null
  if (!POST_STATUSES.includes(status as (typeof POST_STATUSES)[number])) return "Invalid status"
  if (status === "scheduled") {
    const t = typeof publishAt === "string" ? Date.parse(publishAt) : NaN
    if (Number.isNaN(t)) return "Choose a publish date and time"
    if (t < Date.now() - 60_000) return "The publish time must be in the future"
  }
  return null
}

export const SERVICE_FIELDS = [
  "title", "slug", "short_label", "description", "intro", "image", "points", "outcomes",
  "why_it_matters", "faqs",
] as const

export const CASE_STUDY_FIELDS = [
  "title", "slug", "category", "tagline", "about", "challenge", "overview", "solution",
  "insights", "image", "accent", "what_we_did", "results", "metrics", "faqs",
] as const

/** Columns that may be absent on older databases. */
export const OPTIONAL_CONTENT_COLUMNS = ["faqs", "why_it_matters"]

/** Accepts both camelCase (older admin forms) and snake_case keys for services. */
export function normalizeServiceBody(body: Record<string, unknown>): Record<string, unknown> {
  return {
    ...body,
    short_label: body.short_label ?? body.shortLabel,
    why_it_matters: body.why_it_matters ?? body.whyItMatters,
  }
}

export function cleanContentHtml(payload: Record<string, unknown>): Record<string, unknown> {
  if (typeof payload.content === "string") payload.content = sanitizeRichHtml(payload.content)
  return payload
}

/**
 * Response for a failed insert/update. A unique violation (23505) means another request
 * took the slug between our slugTaken() check and the write, so it is a 409, not a 500.
 */
export function writeFailure(error: { code?: string; message?: string } | null, slug: string, message: string) {
  return isUniqueViolation(error) ? slugTakenFail(slug) : serverError(message)
}

/** Returns a normalised slug, or null when it is unusable. */
export function normalizeSlug(value: unknown): string | null {
  const slug = toSlug(typeof value === "string" ? value : "")
  return slug || null
}

/** True when another row in `table` already uses `slug`. */
export async function slugTaken(table: string, slug: string, exceptColumn?: string, exceptValue?: string): Promise<boolean> {
  let query = supabaseAdmin.from(table).select("id").eq("slug", slug).limit(1)
  if (exceptColumn && exceptValue) query = query.neq(exceptColumn, exceptValue)
  const { data } = await query
  return Boolean(data && data.length > 0)
}

const PATH_PREFIX = { blog: "/blog/", service: "/services/", work: "/work/" } as const

/**
 * After a slug rename: 301 the old URL to the new one, and keep the page's SEO meta
 * object attached to the new URL.
 */
export async function moveSeoKey(prefix: "blog" | "service" | "work", oldSlug: string, newSlug: string): Promise<void> {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return
  await recordRedirect(`${PATH_PREFIX[prefix]}${oldSlug}`, `${PATH_PREFIX[prefix]}${newSlug}`)

  const oldKey = `${prefix}:${oldSlug}`
  const newKey = `${prefix}:${newSlug}`
  const { data: target } = await supabaseAdmin.from("seo_setting").select("id").eq("page_key", newKey).maybeSingle()
  if (target) return // never overwrite an existing meta object
  await supabaseAdmin
    .from("seo_setting")
    .update({ page_key: newKey, slug: `${PATH_PREFIX[prefix]}${newSlug}` })
    .eq("page_key", oldKey)
}
