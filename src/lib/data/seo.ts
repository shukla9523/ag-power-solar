/**
 * Purpose: cached reads of page meta objects (seo_setting) and public site settings for
 * metadata and schema. Cached with unstable_cache tags; revalidateContent() clears them.
 */
import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import { supabaseAnon as supabase, supabaseAdmin } from "@lib/supabase-admin"
import { unstable_cache } from "next/cache"

export type SeoSetting = {
  page_key: string
  page_label?: string | null
  meta_title?: string | null
  meta_description?: string | null
  slug?: string | null
  canonical_url?: string | null
  robots_index?: boolean | null
  robots_follow?: boolean | null
  primary_keyword?: string | null
  secondary_keywords?: string[] | null
  meta_keywords?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  og_url?: string | null
  og_type?: string | null
  twitter_card?: string | null
  twitter_title?: string | null
  twitter_description?: string | null
  twitter_image?: string | null
  schema_json?: string | null
  faq_section?: { question: string; answer: string }[] | null
  image_alt?: string | null
  image_title?: string | null
  og_image_alt?: string | null
  field_sources?: Record<string, "human" | "ai"> | null
}

export type SiteSetting = {
  site_name?: string | null
  site_url?: string | null
  logo_url?: string | null
  favicon_url?: string | null
  brand_name?: string | null
  theme_tokens?: unknown
  organization_profile?: unknown
}

type MetadataFallback = {
  title?: string
  description?: string
  canonicalPath?: string
  image?: string | null
  type?: "website" | "article"
  keywords?: string[]
}

function absoluteUrl(value?: string | null) {
  if (!value) return undefined
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }
  return new URL(value.startsWith("/") ? value : `/${value}`, getBaseURL()).toString()
}

function compactKeywords(setting?: SeoSetting | null, fallback?: MetadataFallback) {
  const values = [
    setting?.primary_keyword,
    ...(setting?.secondary_keywords || []),
    setting?.meta_keywords,
    ...(fallback?.keywords || []),
  ]

  return values
    .flatMap((value) => value?.split(",") || [])
    .map((value) => value.trim())
    .filter(Boolean)
}

/**
 * Kept for callers in revalidate.ts. Caching now lives only in unstable_cache (tags
 * site_setting / seo_setting), so revalidateTag() clears it everywhere at once. A second
 * in-memory cache INSIDE unstable_cache used to serve stale values after an admin edit.
 */
export function invalidateSeoMemoryCache(_key?: string): void {
  // Nothing to clear: see note above.
}

/** Only these site_setting columns are ever used by public pages. */
const PUBLIC_SITE_KEYS = ["site_name", "site_url", "logo_url", "favicon_url", "brand_name", "theme_tokens", "organization_profile"] as const

function pickPublicSiteSetting(row: Record<string, unknown>): SiteSetting {
  const out: Record<string, unknown> = {}
  for (const key of PUBLIC_SITE_KEYS) if (key in row) out[key] = row[key]
  return out as SiteSetting
}

export const getSiteSetting = unstable_cache(
  async (): Promise<SiteSetting | null> => {
    try {
      // Read with the server key, then keep public columns only: site_setting also holds
      // private values (e.g. the leads sheet link), so the anon key no longer needs access.
      const { data, error } = await supabaseAdmin.from("site_setting").select("*").limit(1)
      if (error || !data || data.length === 0) return null
      return pickPublicSiteSetting(data[0] as Record<string, unknown>)
    } catch {
      return null
    }
  },
  ["site-setting"],
  { revalidate: 3600, tags: ["site_setting"] }
)

export const getSeoSetting = unstable_cache(
  async (pageKey: string): Promise<SeoSetting | null> => {
    if (!pageKey) return null
    try {
      const { data, error } = await supabase.from("seo_setting").select("*").eq("page_key", pageKey).limit(1)
      if (error || !data || data.length === 0) return null
      return data[0] as SeoSetting
    } catch {
      return null
    }
  },
  ["seo-setting"],
  { revalidate: 300, tags: ["seo_setting"] }
)

export async function getFirstSeoSetting(
  pageKeys: Array<string | undefined | null>
): Promise<SeoSetting | null> {
  const keys = pageKeys.filter(Boolean) as string[]

  for (const key of keys) {
    const setting = await getSeoSetting(key)
    if (setting) return setting
  }

  return null
}

export async function buildSeoMetadata(
  pageKeys: Array<string | undefined | null>,
  fallback: MetadataFallback = {}
): Promise<Metadata> {
  const [setting, site] = await Promise.all([
    getFirstSeoSetting(pageKeys),
    getSiteSetting(),
  ])

  const title = setting?.meta_title || fallback.title
  const description = setting?.meta_description || fallback.description
  const canonical = setting?.slug 
    ? absoluteUrl(setting.slug) 
    : (setting?.canonical_url || absoluteUrl(fallback.canonicalPath))
    
  const ogImage = setting?.og_image || fallback.image
  const twitterImage = setting?.twitter_image || setting?.og_image || fallback.image
  const keywords = compactKeywords(setting, fallback)

  return {
    metadataBase: new URL(site?.site_url || getBaseURL()),
    title,
    description,
    applicationName: site?.site_name || site?.brand_name || undefined,
    keywords: keywords.length ? keywords : undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: setting?.robots_index ?? true,
      follow: setting?.robots_follow ?? true,
    },
    icons: site?.favicon_url ? { icon: site.favicon_url } : undefined,
    openGraph: {
      title: setting?.og_title || title,
      description: setting?.og_description || description,
      url: setting?.og_url || canonical,
      siteName: site?.site_name || site?.brand_name || undefined,
      type: (setting?.og_type as "website" | "article" | undefined) || fallback.type || "website",
      images: ogImage ? [absoluteUrl(ogImage)!] : undefined,
    },
    twitter: {
      card: (setting?.twitter_card as "summary" | "summary_large_image" | undefined) || "summary_large_image",
      title: setting?.twitter_title || setting?.og_title || title,
      description: setting?.twitter_description || setting?.og_description || description,
      images: twitterImage ? [absoluteUrl(twitterImage)!] : undefined,
    },
  }
}
