/**
 * Purpose: make sure every image a blog post uses is a WebP file in our own Supabase Storage.
 *
 * When a post is published (external publisher or admin save), any image URL in
 * featured_image, image_urls or the article HTML that points to OUR public storage and is
 * not WebP is downloaded from storage, converted with toWebp(), uploaded next to the original
 * as .webp, and the URL in the post is swapped. External hosts are never fetched (no SSRF);
 * failures leave the original URL so publishing never breaks.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { toWebp, webpName } from "@lib/util/to-webp"

const NON_WEBP = /\.(png|jpe?g|gif)(\?.*)?$/i

function storagePrefix(): string {
  return `${(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")}/storage/v1/object/public/`
}

/** Splits our public-storage URL into bucket + object path, or null if it is not ours. */
export function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  const prefix = storagePrefix()
  if (!prefix.startsWith("http") || !url.startsWith(prefix)) return null
  const rest = decodeURIComponent(url.slice(prefix.length).split("?")[0])
  const slash = rest.indexOf("/")
  if (slash <= 0) return null
  const bucket = rest.slice(0, slash)
  const path = rest.slice(slash + 1)
  if (!/^[a-z0-9_-]+$/i.test(bucket) || !path || path.includes("..")) return null
  return { bucket, path }
}

/** Converts one storage image to WebP; returns the WebP URL (or the original on failure). */
export async function ensureWebpUrl(url: string | null | undefined, cache = new Map<string, string>()): Promise<string | null | undefined> {
  if (!url || !NON_WEBP.test(url)) return url
  const cached = cache.get(url)
  if (cached) return cached

  const location = parseStorageUrl(url)
  if (!location) return url // external host: never fetched

  try {
    const target = webpName(location.path)
    const { data: existing } = await supabaseAdmin.storage.from(location.bucket).list(target.includes("/") ? target.slice(0, target.lastIndexOf("/")) : "", {
      search: target.split("/").pop(),
    })
    if (!existing?.some((f) => f.name === target.split("/").pop())) {
      const { data: file, error } = await supabaseAdmin.storage.from(location.bucket).download(location.path)
      if (error || !file) return url
      if (file.size > 15 * 1024 * 1024) return url
      const webp = await toWebp(new Uint8Array(await file.arrayBuffer()))
      const up = await supabaseAdmin.storage
        .from(location.bucket)
        .upload(target, webp.buffer, { contentType: "image/webp", upsert: true, cacheControl: "31536000" })
      if (up.error) return url
    }
    const webpUrl = supabaseAdmin.storage.from(location.bucket).getPublicUrl(target).data.publicUrl
    cache.set(url, webpUrl)
    return webpUrl
  } catch {
    return url
  }
}

/** Rewrites <img src> / srcset URLs inside article HTML. */
export async function webpifyHtml(html: string | null | undefined, cache = new Map<string, string>()): Promise<string | null | undefined> {
  if (!html) return html
  const urls = new Set<string>()
  for (const m of Array.from(html.matchAll(/(?:src|srcset)=["']([^"']+)["']/gi))) {
    for (const part of m[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0]
      if (candidate && NON_WEBP.test(candidate) && parseStorageUrl(candidate)) urls.add(candidate)
    }
  }
  let out = html
  for (const original of Array.from(urls)) {
    const converted = await ensureWebpUrl(original, cache)
    if (converted && converted !== original) out = out.split(original).join(converted)
  }
  return out
}

/** Applies WebP conversion to every image field of a post payload (in place, returns it). */
export async function webpifyPost<T extends Record<string, unknown>>(post: T): Promise<T> {
  const cache = new Map<string, string>()
  const out: Record<string, unknown> = { ...post }
  if (typeof out.featured_image === "string") out.featured_image = await ensureWebpUrl(out.featured_image, cache)
  if (Array.isArray(out.image_urls)) {
    out.image_urls = await Promise.all((out.image_urls as unknown[]).map((u) => (typeof u === "string" ? ensureWebpUrl(u, cache) : u)))
  }
  if (typeof out.content === "string") out.content = await webpifyHtml(out.content, cache)
  return out as T
}
