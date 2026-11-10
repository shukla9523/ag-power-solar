/**
 * Purpose: XML sitemaps built from the page registry (every published page).
 *
 * - Child sitemaps: pages, services, blogs, work (the index at /sitemap.xml lists them).
 * - Real <lastmod> from each row's updated date (no fake "now").
 * - Pages whose meta object says noindex are excluded.
 * - All values are XML-escaped; images are listed with image:image for image search.
 */

import "server-only"
import { getPageRegistry, RegisteredPage } from "./page-registry"
import { listSeoRows } from "./seo-store"
import { DEFAULT_BASE_URL } from "@lib/schema/config"

export const SITEMAP_NAMES = ["pages", "services", "blogs", "work"] as const
export type SitemapName = (typeof SITEMAP_NAMES)[number]

const KIND_BY_SITEMAP: Record<SitemapName, RegisteredPage["kind"]> = {
  pages: "static",
  services: "service",
  blogs: "blog",
  work: "case-study",
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${DEFAULT_BASE_URL}${path === "/" ? "/" : path}`
}

function isoDate(value?: string | null): string | null {
  if (!value) return null
  const t = Date.parse(value)
  return Number.isNaN(t) ? null : new Date(t).toISOString()
}

async function indexablePages(): Promise<RegisteredPage[]> {
  const [pages, rows] = await Promise.all([getPageRegistry(), listSeoRows().catch(() => [])])
  const noindex = new Set(rows.filter((r) => r.robots_index === false).map((r) => String(r.page_key)))
  const updatedAt = new Map(rows.map((r) => [String(r.page_key), String(r.updated_at || "")]))

  return pages
    .filter((p) => !noindex.has(p.pageKey) && !(p.legacyKeys || []).some((k) => noindex.has(k)))
    .map((p) => {
      // A meta-object edit also counts as a modification of the page.
      const candidates = [p.lastModified, updatedAt.get(p.pageKey)].map(isoDate).filter(Boolean) as string[]
      return { ...p, lastModified: candidates.sort().pop() || null }
    })
}

export async function buildChildSitemap(name: SitemapName): Promise<string> {
  const kind = KIND_BY_SITEMAP[name]
  const pages = (await indexablePages()).filter((p) => p.kind === kind)

  const urls = pages
    .map((p) => {
      const lastmod = p.lastModified ? `\n    <lastmod>${p.lastModified}</lastmod>` : ""
      const image =
        p.image && !p.image.endsWith(".svg")
          ? `\n    <image:image><image:loc>${escapeXml(absolute(p.image))}</image:loc></image:image>`
          : ""
      return `  <url>\n    <loc>${escapeXml(absolute(p.path))}</loc>${lastmod}${image}\n  </url>`
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`
}

export async function buildSitemapIndex(): Promise<string> {
  const pages = await indexablePages()
  const entries = SITEMAP_NAMES.map((name) => {
    const dates = pages
      .filter((p) => p.kind === KIND_BY_SITEMAP[name])
      .map((p) => p.lastModified)
      .filter(Boolean) as string[]
    const lastmod = dates.sort().pop()
    return `  <sitemap>\n    <loc>${escapeXml(`${DEFAULT_BASE_URL}/sitemap/${name}.xml`)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </sitemap>`
  }).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`
}

export const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "X-Robots-Tag": "noindex",
}
