/**
 * Purpose: Admin → Products API for the editable EDITZ and Blog AI pages (admin, marketer).
 *
 * GET              → merged content (defaults + overrides) and which sections are overridden.
 * PUT { section, value } → Zod-validated override saved into product_pages.content.
 * DELETE ?section= → removes that override so the code default applies again.
 * Every write revalidates the "product-pages" tag and the public path and is audited.
 * Errors are generic; a missing table (migration M-05 not run) returns 503.
 */

import { NextRequest } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { requireSession, type UserSession } from "@lib/auth-helpers"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { PRODUCT_PAGES_TAG } from "@lib/data/product-pages"
import {
  PRODUCT_PATHS,
  isProductSlug,
  isSectionKey,
  mergeProductContent,
  toOverrideObject,
  validateSection,
  type ProductSlug,
} from "@lib/validation/product-pages"
import { fail, failWithStatus, forbidden, notFound, ok } from "@lib/util/api-response"

type RouteContext = { params: Promise<{ slug: string }> }
type DbError = { code?: string; message?: string } | null

const MIGRATION_MESSAGE = "Run database migration M-05 first"

function isMissingTable(error: DbError): boolean {
  if (!error) return false
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /relation .* does not exist|could not find the table/i.test(error.message || "")
  )
}

type LoadResult =
  | { ok: true; overrides: Record<string, unknown>; updatedAt: string | null; updatedBy: string | null }
  | { ok: false; status: number; error: string }

async function loadRow(slug: ProductSlug): Promise<LoadResult> {
  try {
    const { data, error } = await supabaseAdmin
      .from("product_pages")
      .select("content, updated_at, updated_by")
      .eq("slug", slug)
      .maybeSingle()
    if (error) {
      return isMissingTable(error)
        ? { ok: false, status: 503, error: MIGRATION_MESSAGE }
        : { ok: false, status: 500, error: "Could not load product content" }
    }
    const row = data as { content?: unknown; updated_at?: string | null; updated_by?: string | null } | null
    return {
      ok: true,
      overrides: toOverrideObject(row?.content),
      updatedAt: row?.updated_at ?? null,
      updatedBy: row?.updated_by ?? null,
    }
  } catch {
    return { ok: false, status: 500, error: "Could not load product content" }
  }
}

async function saveOverrides(slug: ProductSlug, overrides: Record<string, unknown>, session: UserSession) {
  try {
    const { error } = await supabaseAdmin
      .from("product_pages")
      .upsert(
        { slug, content: overrides, updated_by: session.email, updated_at: new Date().toISOString() },
        { onConflict: "slug" }
      )
    if (!error) return null
    return isMissingTable(error) ? { status: 503, error: MIGRATION_MESSAGE } : { status: 500, error: "Could not save product content" }
  } catch {
    return { status: 500, error: "Could not save product content" }
  }
}

function refresh(slug: ProductSlug) {
  revalidateTag(PRODUCT_PAGES_TAG)
  revalidatePath(PRODUCT_PATHS[slug])
}

function responseBody(slug: ProductSlug, overrides: Record<string, unknown>, updatedAt: string | null, updatedBy: string | null) {
  const { content, overridden } = mergeProductContent(slug, overrides)
  return { slug, path: PRODUCT_PATHS[slug], content, overridden, updatedAt, updatedBy }
}

async function authorize(req: NextRequest, context: RouteContext) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) return { response: forbidden() } as const
  const { slug } = await context.params
  if (!isProductSlug(slug)) return { response: notFound("Unknown product") } as const
  return { session, slug } as const
}

export async function GET(req: NextRequest, context: RouteContext) {
  const auth = await authorize(req, context)
  if ("response" in auth) return auth.response

  const loaded = await loadRow(auth.slug)
  if (!loaded.ok) return failWithStatus(loaded.error, loaded.status)
  return ok(responseBody(auth.slug, loaded.overrides, loaded.updatedAt, loaded.updatedBy))
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const auth = await authorize(req, context)
  if ("response" in auth) return auth.response
  const { session, slug } = auth

  const body = (await req.json().catch(() => null)) as { section?: unknown; value?: unknown } | null
  if (!body || !isSectionKey(slug, body.section)) {
    return fail("Unknown section")
  }
  const section = body.section
  const validation = validateSection(slug, section, body.value)
  if (!validation.ok) return fail(validation.error)

  const loaded = await loadRow(slug)
  if (!loaded.ok) return failWithStatus(loaded.error, loaded.status)

  const before = loaded.overrides[section] ?? null
  const next = { ...loaded.overrides, [section]: validation.value }
  const failed = await saveOverrides(slug, next, session)
  if (failed) return failWithStatus(failed.error, failed.status)

  refresh(slug)
  await recordAudit({
    actor: session,
    action: "product.update",
    entityType: "product",
    entityKey: `${slug}:${section}`,
    before: { value: before },
    after: { value: validation.value },
  })
  return ok(responseBody(slug, next, new Date().toISOString(), session.email))
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const auth = await authorize(req, context)
  if ("response" in auth) return auth.response
  const { session, slug } = auth

  const section = req.nextUrl.searchParams.get("section")
  if (!isSectionKey(slug, section)) return fail("Unknown section")

  const loaded = await loadRow(slug)
  if (!loaded.ok) return failWithStatus(loaded.error, loaded.status)

  const before = loaded.overrides[section] ?? null
  const next = { ...loaded.overrides }
  delete next[section]

  // Nothing stored for this section: already on the default, no write needed.
  if (before === null) {
    return ok(responseBody(slug, next, loaded.updatedAt, loaded.updatedBy))
  }

  const failed = await saveOverrides(slug, next, session)
  if (failed) return failWithStatus(failed.error, failed.status)
  refresh(slug)
  await recordAudit({
    actor: session,
    action: "product.reset",
    entityType: "product",
    entityKey: `${slug}:${section}`,
    before: { value: before },
    after: { value: null },
  })
  return ok(responseBody(slug, next, new Date().toISOString(), session.email))
}
