/**
 * Purpose: give every service, blog post and case study a relevant image.
 *
 * Image resolution for a page: database image → static /og/services/{slug}.jpg file →
 * AI image (generated once, then kept). Only items with NO usable image are generated;
 * an existing image (human or AI) is never replaced. Each generated image gets a
 * keyword-based alt text and title in the page's meta object (empty fields only).
 *
 * Images are generated with Cloudflare Workers AI, converted to WebP (1600×900 hero) plus a
 * 1200×630 share variant with sharp, stored in the public `media` bucket, and logged in
 * `media_assets` so admins can review or replace them.
 */

import "server-only"
import sharp from "sharp"
import { supabaseAdmin } from "@lib/supabase-admin"
import { revalidateContent } from "@lib/revalidate"
import { getBaseURL } from "@lib/util/env"
import { getSeoRow, fillEmptySeoFields } from "@lib/seo/seo-store"
import { isEmptyValue } from "@lib/seo/meta-fields"
import { AiDisabledError, generateImage } from "./ai-provider"
import { notifyAdmins } from "./notifications"

const BUCKET = "media"
const TIME_BUDGET_MS = 240_000
const PROMPT_VERSION = "image.v1"

type Target = {
  kind: "service" | "blog" | "case-study"
  table: "services" | "post" | "case_studies"
  idColumn: string
  id: string
  slug: string
  title: string
  summary: string
  imageColumn: "image" | "featured_image"
  pageKey: string
}

export interface ImageFillResult {
  checked: number
  generated: { pageKey: string; url: string }[]
  missingBefore: number
  errors: string[]
}

async function urlExists(path: string): Promise<boolean> {
  try {
    const url = path.startsWith("http") ? path : `${getBaseURL()}${path}`
    const res = await fetch(url, { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}

async function ensureBucket(): Promise<void> {
  const { data } = await supabaseAdmin.storage.getBucket(BUCKET)
  if (!data) {
    await supabaseAdmin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ["image/webp", "image/jpeg", "image/png"],
    })
  }
}

/** Items whose image is missing (empty in DB and no static fallback file). */
export async function findItemsMissingImages(): Promise<Target[]> {
  const [services, posts, studies] = await Promise.all([
    supabaseAdmin.from("services").select("id, slug, title, description, intro, image"),
    supabaseAdmin
      .from("post")
      .select("id, slug, title, excerpt, featured_image")
      .eq("status", "published")
      .is("deleted_at", null),
    supabaseAdmin.from("case_studies").select("id, slug, title, tagline, image"),
  ])

  const missing: Target[] = []

  for (const s of services.data || []) {
    if (s.image?.trim()) continue
    if (await urlExists(`/og/services/${s.slug}.jpg`)) continue
    missing.push({
      kind: "service", table: "services", idColumn: "slug", id: s.slug, slug: s.slug,
      title: s.title, summary: s.description || s.intro || "", imageColumn: "image", pageKey: `service:${s.slug}`,
    })
  }
  for (const p of posts.data || []) {
    if (p.featured_image?.trim()) continue
    missing.push({
      kind: "blog", table: "post", idColumn: "id", id: p.id, slug: p.slug,
      title: p.title, summary: p.excerpt || "", imageColumn: "featured_image", pageKey: `blog:${p.slug}`,
    })
  }
  for (const c of studies.data || []) {
    if (c.image?.trim()) continue
    missing.push({
      kind: "case-study", table: "case_studies", idColumn: "id", id: String(c.id), slug: c.slug,
      title: c.title, summary: c.tagline || "", imageColumn: "image", pageKey: `work:${c.slug}`,
    })
  }
  return missing
}

function buildPrompt(target: Target, keyword: string | null): string {
  const topic = keyword || target.title
  return [
    `Editorial hero image for a digital marketing agency article about "${topic}".`,
    target.summary ? `Context: ${target.summary.slice(0, 300)}.` : "",
    "Modern, clean, professional, photographic or tasteful 3D illustration,",
    "brand accent colours deep pink (#e61e73) and navy blue (#0e2547), soft natural light,",
    "Indian business context where people appear, wide 16:9 composition with empty space.",
    "No text, no letters, no words, no logos, no watermarks, no real celebrities.",
  ].join(" ")
}

async function generateFor(target: Target): Promise<string> {
  const seo = await getSeoRow(target.pageKey)
  const keyword = (seo?.primary_keyword as string) || null

  const raw = await generateImage(buildPrompt(target, keyword))
  const hero = await sharp(raw).resize(1600, 900, { fit: "cover" }).webp({ quality: 82 }).toBuffer()
  const share = await sharp(raw).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer()

  const base = `${target.kind}/${target.slug}-${Date.now()}`
  const heroPath = `${base}.webp`
  const sharePath = `${base}-og.jpg`

  const up1 = await supabaseAdmin.storage.from(BUCKET).upload(heroPath, hero, { contentType: "image/webp", upsert: false })
  const up2 = await supabaseAdmin.storage.from(BUCKET).upload(sharePath, share, { contentType: "image/jpeg", upsert: false })
  if (up1.error || up2.error) throw new Error("Storage upload failed")

  const heroUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(heroPath).data.publicUrl
  const shareUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(sharePath).data.publicUrl

  // Attach only if the item still has no image (a person may have added one meanwhile).
  const { data: updated } = await supabaseAdmin
    .from(target.table)
    .update({ [target.imageColumn]: heroUrl })
    .eq(target.idColumn, target.id)
    .or(`${target.imageColumn}.is.null,${target.imageColumn}.eq.`)
    .select(target.idColumn)

  if (!updated || updated.length === 0) {
    await supabaseAdmin.storage.from(BUCKET).remove([heroPath, sharePath])
    return ""
  }

  const label = (keyword || target.title).trim()
  await fillEmptySeoFields(
    target.pageKey,
    {
      og_image: shareUrl,
      twitter_image: shareUrl,
      image_title: label.slice(0, 70),
      image_alt: `${label} — ${target.title} by Mommantum`.slice(0, 125),
      og_image_alt: `${label} — Mommantum, Jaipur`.slice(0, 125),
    },
    isEmptyValue
  )

  try {
    await supabaseAdmin.from("media_assets").insert([
      { storage_path: heroPath, url: heroUrl, mime_type: "image/webp", width: 1600, height: 900, variant: "hero", source: "ai", status: "auto_attached", prompt_version: PROMPT_VERSION, alt_text: label, attached_entity: target.pageKey },
      { storage_path: sharePath, url: shareUrl, mime_type: "image/jpeg", width: 1200, height: 630, variant: "og_1200x630", source: "ai", status: "auto_attached", prompt_version: PROMPT_VERSION, alt_text: label, attached_entity: target.pageKey },
    ])
  } catch {
    // media_assets exists after the 2026-11-08 migration.
  }

  const type = target.kind === "blog" ? "blog" : target.kind === "service" ? "service" : "case-study"
  await revalidateContent({ type, slug: target.slug })
  await revalidateContent({ type: "seo", pageKey: target.pageKey })
  return heroUrl
}

export class ImageFillService {
  static async run(options: { limit?: number; pageKey?: string; trigger?: string } = {}): Promise<ImageFillResult> {
    const result: ImageFillResult = { checked: 0, generated: [], missingBefore: 0, errors: [] }
    const started = Date.now()

    let targets = await findItemsMissingImages()
    result.missingBefore = targets.length
    if (options.pageKey) targets = targets.filter((t) => t.pageKey === options.pageKey)
    targets = targets.slice(0, Math.min(options.limit || 5, 25))
    if (targets.length === 0) return result

    await ensureBucket()

    for (const target of targets) {
      if (Date.now() - started > TIME_BUDGET_MS) break
      result.checked++
      try {
        const url = await generateFor(target)
        if (url) result.generated.push({ pageKey: target.pageKey, url })
      } catch (err) {
        result.errors.push(`${target.pageKey}: ${err instanceof Error ? err.message : "failed"}`)
        if (err instanceof AiDisabledError) break
      }
    }

    if (result.generated.length || result.errors.length) {
      await notifyAdmins({
        type: "ai_job",
        title: "AI images generated",
        body: `Generated ${result.generated.length} image(s) for items that had none; ${result.errors.length} error(s).`,
        link: "/admin/seo/report",
      })
    }
    return result
  }
}
