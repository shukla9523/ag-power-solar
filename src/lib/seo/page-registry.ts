/**
 * Purpose: one registry of every indexable URL on mommantum.com and the meta-object key
 * (seo_setting.page_key) that belongs to it.
 *
 * Used by the sitemaps, the keyword internal-linking engine, the monthly AI fill and the
 * SEO report, so all four always agree on which pages exist.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { PAGE_META_DEFAULTS } from "@lib/schema/page-defaults"
import { namedCache } from "@lib/util/ttl-cache"
import { FALLBACK_SERVICES } from "@lib/data/fallback-services"

export type PageKind = "static" | "service" | "blog" | "case-study"

export interface RegisteredPage {
  kind: PageKind
  /** seo_setting.page_key */
  pageKey: string
  /** Alternative keys read for backwards compatibility. */
  legacyKeys?: string[]
  path: string
  title: string
  description: string
  /** Plain text used for keyword matching and AI grounding. */
  text: string
  image?: string | null
  lastModified?: string | null
  /** Group used to judge topical relevance for internal links. */
  cluster: string
}

/** Static pages with their routes (keys match the existing seo_setting rows). */
export const STATIC_PAGES: { key: string; path: string; cluster: string }[] = [
  { key: "homepage", path: "/", cluster: "brand" },
  { key: "about", path: "/about", cluster: "brand" },
  { key: "services", path: "/services", cluster: "services" },
  { key: "work", path: "/work", cluster: "work" },
  { key: "blog", path: "/blog", cluster: "blog" },
  { key: "editz", path: "/editz", cluster: "video" },
  { key: "blog-ai", path: "/blog-ai", cluster: "ai" },
  { key: "faq", path: "/faq", cluster: "brand" },
  { key: "contact", path: "/contact", cluster: "brand" },
  { key: "privacy-policy", path: "/privacy-policy", cluster: "legal" },
  { key: "terms-and-conditions", path: "/terms-and-conditions", cluster: "legal" },
]

/** Pages that never receive automatic internal links or keyword ownership. */
/** Per-page share image in /public/og/pages (files exist for every static page). */
function staticPageImage(key: string): string {
  return `/og/pages/${key === "homepage" ? "home" : key}.jpg`
}

/** Runs a Supabase query and returns its rows, or [] when the query errors or throws. */
async function safeRows(query: PromiseLike<{ data: any[] | null; error: unknown }>): Promise<any[]> {
  try {
    const { data, error } = await query
    return error || !Array.isArray(data) ? [] : data
  } catch {
    return []
  }
}

export const NON_LINKABLE_KEYS = new Set(["privacy-policy", "terms-and-conditions", "contact"])

export function htmlToText(html: string | null | undefined): string {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function serviceCluster(slug: string): string {
  if (/video|motion|podcast|script|content/.test(slug)) return "video"
  if (/ai-|automation|agentic/.test(slug)) return "ai"
  if (/web|app/.test(slug)) return "web"
  return "marketing"
}

const registryCache = namedCache<RegisteredPage[]>("page-registry", 5 * 60 * 1000, 4)

async function loadRegistry(): Promise<RegisteredPage[]> {
  const pages: RegisteredPage[] = STATIC_PAGES.map((p) => ({
    kind: "static",
    pageKey: p.key,
    path: p.path,
    title: PAGE_META_DEFAULTS[p.key]?.title || p.key,
    description: PAGE_META_DEFAULTS[p.key]?.description || "",
    text: `${PAGE_META_DEFAULTS[p.key]?.title || ""} ${PAGE_META_DEFAULTS[p.key]?.description || ""}`,
    image: staticPageImage(p.key),
    cluster: p.cluster,
  }))

  // Each query fails independently; an empty or failed kind yields no rows except services,
  // which fall back to the built-in list so /sitemap/services.xml is never empty.
  const [dbServices, posts, studies] = await Promise.all([
    safeRows(supabaseAdmin.from("services").select("*")),
    safeRows(
      supabaseAdmin
        .from("post")
        .select("id, slug, title, excerpt, content, featured_image, updated_at, published_at, category_id")
        .eq("status", "published")
        .is("deleted_at", null)
    ),
    safeRows(supabaseAdmin.from("case_studies").select("*")),
  ])

  const services: any[] = dbServices.filter((s) => s && s.slug).length
    ? dbServices.filter((s) => s && s.slug)
    : Object.values(FALLBACK_SERVICES)

  for (const s of services) {
    pages.push({
      kind: "service",
      pageKey: `service:${s.slug}`,
      path: `/services/${s.slug}`,
      title: s.title || s.slug,
      description: s.description || s.intro || "",
      text: htmlToText([s.title, s.description, s.intro, ...(s.points || []), ...(s.outcomes || [])].join(" ")),
      image: s.image || `/og/services/${s.slug}.jpg`,
      lastModified: s.updated_at || s.created_at || null,
      cluster: serviceCluster(s.slug),
    })
  }

  for (const p of posts) {
    if (!p?.slug) continue
    pages.push({
      kind: "blog",
      pageKey: `blog:${p.slug}`,
      path: `/blog/${p.slug}`,
      title: p.title || p.slug,
      description: p.excerpt || "",
      text: htmlToText(`${p.title} ${p.excerpt} ${p.content}`),
      image: p.featured_image || null,
      lastModified: p.updated_at || p.published_at || null,
      cluster: "blog",
    })
  }

  for (const c of studies) {
    if (!c?.slug) continue
    pages.push({
      kind: "case-study",
      pageKey: `work:${c.slug}`,
      legacyKeys: [`case-study:${c.slug}`],
      path: `/work/${c.slug}`,
      title: c.title || c.slug,
      description: c.tagline || c.overview || "",
      text: htmlToText([c.title, c.tagline, c.about, c.challenge, c.overview, c.solution, c.insights].join(" ")),
      image: c.image || null,
      lastModified: c.updated_at || c.created_at || null,
      cluster: "work",
    })
  }

  return pages
}

/** All indexable pages (cached 5 minutes, cleared on content revalidation). */
export function getPageRegistry(): Promise<RegisteredPage[]> {
  return registryCache.getOrSet("all", loadRegistry)
}

export function clearPageRegistry(): void {
  registryCache.clear()
}
