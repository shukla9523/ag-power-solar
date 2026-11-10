/**
 * Purpose: draft preview links and scheduled publishing for blog posts.
 *
 * Preview links are signed (HMAC-SHA256 with PREVIEW_SECRET, a dedicated secret with no
 * fallback) and expire after 7 days. Opening one turns on Next.js draft mode for that browser
 * AND sets a signed cookie naming the one post it unlocks, so a link for post A never shows B.
 */

import "server-only"
import { createHmac, timingSafeEqual } from "crypto"
import { supabaseAdmin } from "@lib/supabase-admin"
import type { BlogPost } from "./blog-posts"

const PREVIEW_TTL_SECONDS = 7 * 24 * 60 * 60

function secret(): string {
  const value = process.env.PREVIEW_SECRET
  if (!value) throw new Error("PREVIEW_SECRET is not configured")
  return value
}

function sign(slug: string, exp: number): string {
  return createHmac("sha256", secret()).update(`${slug}.${exp}`).digest("hex")
}

/** Relative URL that opens the post in preview mode. */
export function createPreviewUrl(slug: string): { url: string; expiresAt: string } {
  const exp = Math.floor(Date.now() / 1000) + PREVIEW_TTL_SECONDS
  const params = new URLSearchParams({ slug, exp: String(exp), sig: sign(slug, exp) })
  return { url: `/api/preview?${params}`, expiresAt: new Date(exp * 1000).toISOString() }
}

export function verifyPreview(slug: string, exp: string, sig: string): boolean {
  const expiry = Number(exp)
  if (!slug || !Number.isFinite(expiry) || expiry * 1000 < Date.now() || !/^[0-9a-f]{64}$/.test(sig)) return false
  try {
    return timingSafeEqual(Buffer.from(sign(slug, expiry), "hex") as unknown as Uint8Array, Buffer.from(sig, "hex") as unknown as Uint8Array)
  } catch {
    return false
  }
}

export const PREVIEW_COOKIE = "mm-preview"

/** Cookie value binding draft mode to one slug: "<slug>.<exp>.<sig>". */
export function previewCookieValue(slug: string, exp: string, sig: string): string {
  return `${slug}.${exp}.${sig}`
}

/** True when the preview cookie was signed for exactly this slug and has not expired. */
export function previewCookieAllows(value: string | undefined, slug: string): boolean {
  if (!value) return false
  const parts = value.split(".")
  if (parts.length !== 3 || parts[0] !== slug) return false
  return verifyPreview(parts[0], parts[1], parts[2])
}

/** Any-status read (drafts, scheduled) — only for draft mode and admin previews. */
export async function getBlogPostAnyStatus(slug: string): Promise<BlogPost | null> {
  const { data } = await supabaseAdmin.from("post").select("*").eq("slug", slug).is("deleted_at", null).maybeSingle()
  if (!data) return null
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category_id: data.category_id || null,
    featured_image: data.featured_image || null,
    image_urls: data.image_urls || [],
    excerpt: data.excerpt || null,
    content: data.content || null,
    author_name: data.author_name || null,
    status: data.status || "draft",
    published_at: data.published_at || null,
    updated_at: data.updated_at || null,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    faqs: data.faqs || [],
  }
}

/** Publishes every scheduled post whose time has come. Returns the published slugs. */
export async function publishDuePosts(): Promise<{ id: string; slug: string; title: string }[]> {
  const now = new Date().toISOString()
  const { data } = await supabaseAdmin
    .from("post")
    .select("id, slug, title, publish_at")
    .eq("status", "scheduled")
    .lte("publish_at", now)
    .is("deleted_at", null)
    .limit(50)

  const published: { id: string; slug: string; title: string }[] = []
  for (const post of data || []) {
    const { data: rows, error } = await supabaseAdmin
      .from("post")
      .update({ status: "published", published_at: post.publish_at || now, updated_at: now })
      .eq("id", post.id)
      .eq("status", "scheduled") // never re-publish something a person changed meanwhile
      .select("id")
    // Count it only when a row really changed (the status was still "scheduled").
    if (!error && rows && rows.length > 0) published.push({ id: post.id, slug: post.slug, title: post.title })
  }
  return published
}
