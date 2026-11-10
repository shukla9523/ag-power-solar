/**
 * Purpose: admin API for per-page meta objects (`seo_setting`).
 *
 * GET  ?page_key=blog:my-post → that single row (any page type, including blog posts)
 * GET                         → all site page rows (blog rows live in the Blog section)
 * POST { page_key, ...fields, clear_fields? } → whitelisted save. Empty values never erase
 *      stored values unless named in clear_fields; every saved field is marked "human"
 *      so the AI fill job never changes it.
 * DELETE ?page_key=           → removes the overrides (page falls back to templates)
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { z } from "zod"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { buildHumanMetaUpdate } from "@lib/seo/meta-fields"
import { getSeoRow, listSeoRows, writeSeoRow } from "@lib/seo/seo-store"
import { supabaseAdmin } from "@lib/supabase-admin"
import { fail, forbidden, ok, serverError } from "@lib/util/api-response"

const ROLES = ["admin", "marketer"]
const PAGE_KEY = z.string().trim().min(1).max(200).regex(/^[a-z0-9:/_-]+$/i)

const SaveSchema = z
  .object({
    page_key: PAGE_KEY,
    clear_fields: z.array(z.string()).max(40).optional(),
    meta_title: z.string().max(200).nullish(),
    meta_description: z.string().max(500).nullish(),
    primary_keyword: z.string().max(120).nullish(),
    secondary_keywords: z.union([z.array(z.string().max(120)).max(10), z.string().max(600)]).nullish(),
    canonical_url: z.string().max(500).nullish(),
    robots_index: z.boolean().nullish(),
    robots_follow: z.boolean().nullish(),
    og_title: z.string().max(200).nullish(),
    og_description: z.string().max(500).nullish(),
    og_image: z.string().max(1000).nullish(),
    og_url: z.string().max(500).nullish(),
    og_type: z.string().max(40).nullish(),
    twitter_card: z.string().max(40).nullish(),
    twitter_title: z.string().max(200).nullish(),
    twitter_description: z.string().max(500).nullish(),
    twitter_image: z.string().max(1000).nullish(),
    image_alt: z.string().max(200).nullish(),
    image_title: z.string().max(200).nullish(),
    og_image_alt: z.string().max(200).nullish(),
    schema_json: z.string().max(50_000).nullish(),
    faq_section: z.array(z.object({ question: z.string().max(300), answer: z.string().max(3000) })).max(30).nullish(),
    page_label: z.string().max(200).nullish(),
    slug: z.string().max(300).nullish(),
    meta_keywords: z.string().max(600).nullish(),
  })
  .passthrough()

function normalizeKeywords(value: unknown): string[] | null | undefined {
  if (value === undefined) return undefined
  if (value === null) return null
  const list = Array.isArray(value) ? value : String(value).split(",")
  const clean = Array.from(new Set(list.map((k) => String(k).trim()).filter(Boolean))).slice(0, 4)
  return clean.length ? clean : null
}

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ROLES))) {
    return forbidden()
  }

  try {
    const pageKey = req.nextUrl.searchParams.get("page_key")
    if (pageKey) {
      const parsed = PAGE_KEY.safeParse(pageKey)
      if (!parsed.success) return fail("Invalid page_key")
      return ok({ setting: await getSeoRow(parsed.data) })
    }

    const settings = (await listSeoRows()).filter((s) => !String(s.page_key).toLowerCase().startsWith("blog:"))
    return ok({ settings })
  } catch {
    return serverError("Could not load SEO settings")
  }
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ROLES)
  if (!session) {
    return forbidden()
  }

  const parsed = SaveSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return fail("Invalid SEO payload")
  }

  try {
    const body: Record<string, unknown> = { ...parsed.data }
    const keywords = normalizeKeywords(body.secondary_keywords)
    if (keywords !== undefined) body.secondary_keywords = keywords

    const stored = await getSeoRow(parsed.data.page_key)
    const { update, sources } = buildHumanMetaUpdate(body, stored, parsed.data.clear_fields || [])
    const setting = await writeSeoRow(parsed.data.page_key, { ...update, field_sources: sources })
    await recordAudit({ actor: session, action: "seo.update", entityType: "seo", entityKey: parsed.data.page_key, before: stored, after: setting })

    await revalidateContent({ type: "seo", pageKey: parsed.data.page_key })
    return ok({ setting })
  } catch {
    return serverError("Could not save SEO settings")
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireSession(req, ROLES)
  if (!session) {
    return forbidden()
  }

  const parsed = PAGE_KEY.safeParse(req.nextUrl.searchParams.get("page_key"))
  if (!parsed.success) return fail("page_key is required")

  const before = await getSeoRow(parsed.data)
  const { error } = await supabaseAdmin.from("seo_setting").delete().eq("page_key", parsed.data)
  if (error) return serverError("Could not delete SEO settings")
  await recordAudit({ actor: session, action: "seo.reset", entityType: "seo", entityKey: parsed.data, before, after: null })

  await revalidateContent({ type: "seo", pageKey: parsed.data })
  return ok({ deleted: parsed.data })
}
