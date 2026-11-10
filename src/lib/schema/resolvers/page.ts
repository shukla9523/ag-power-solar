import { SeoSetting } from "@lib/data/seo"
import { getEditzFaqs, getPageFaqs } from "@lib/data/page-faqs"
import { DEFAULT_BASE_URL, EDITZ_SERVICE_LINKS } from "../config"
import { getPageMetaDefault } from "../page-defaults"
import { devWarn } from "../validate"
import { ResolvedData } from "./types"

/**
 * Per-page 1200x630 share image in /public/og/pages/<key>.jpg (exists for every static page);
 * used when the page's meta object has no og_image.
 */
export function pageShareImage(key: string): string {
  return `${DEFAULT_BASE_URL}/og/pages/${key}.jpg`
}

function cleanAndDedupeKeywords(rawKeywords: Array<string | undefined | null>): string[] | undefined {
  const seen = new Set<string>()
  const result: string[] = []
  for (const k of rawKeywords) {
    if (!k || typeof k !== "string") continue
    const trimmed = k.trim()
    if (!trimmed) continue
    const lower = trimmed.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      result.push(trimmed)
    }
  }
  return result.length > 0 ? result.slice(0, 6) : undefined
}

export function resolveHomepageData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("homepage")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/`
  const image = seoSetting?.og_image || pageShareImage("home")

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Homepage] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const faqs = getPageFaqs("homepage", seoSetting)

  return {
    contentType: "homepage",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    // A breadcrumb is the page's position in the site; the homepage is the root.
    breadcrumbs: [{ name: "Home", url: `${DEFAULT_BASE_URL}/` }],
    faqs,
  }
}

export function resolveAboutData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("about")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/about`
  const image = seoSetting?.og_image || pageShareImage("about")

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[About] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "about",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "About", url: canonicalUrl },
    ],
    faqs: getPageFaqs("about", seoSetting),
  }
}

export function resolveContactData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("contact")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/contact`
  const image = seoSetting?.og_image || pageShareImage("contact")

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Contact] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "contact",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Contact", url: canonicalUrl },
    ],
    faqs: getPageFaqs("contact", seoSetting),
  }
}

export function resolveLegalPageData(
  slug: "privacy-policy" | "terms-and-conditions" | "blog-ai" | "faq",
  fallbackTitle: string,
  fallbackDescription: string,
  seoSetting?: SeoSetting | null,
  faqs?: Array<{ question: string; answer: string }>
): ResolvedData {
  const fallback = getPageMetaDefault(slug)
  const title = seoSetting?.meta_title || fallback?.title || fallbackTitle
  const description = seoSetting?.meta_description || fallback?.description || fallbackDescription
  const canonicalUrl = `${DEFAULT_BASE_URL}/${slug}`
  const image = seoSetting?.og_image || pageShareImage(slug)

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[${slug}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const resolvedFaqs = faqs && faqs.length ? faqs : getPageFaqs(slug, seoSetting)

  return {
    contentType: "page",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: (fallback?.title || fallbackTitle).split(" | ")[0], url: canonicalUrl },
    ],
    faqs: resolvedFaqs,
    ...(slug === "blog-ai"
      ? {
          primaryService: {
            name: "Blog AI by Mommantum",
            description,
            serviceType: "AI blog writing and publishing",
          },
        }
      : {}),
  }
}

export function resolveEditzData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("editz")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/editz`
  const image = seoSetting?.og_image || pageShareImage("editz")

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Editz] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "editz",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Editz", url: canonicalUrl },
    ],
    faqs: getEditzFaqs(seoSetting),
    primaryService: {
      name: "EDITZ by Mommantum — Video Editing Studio",
      description,
      serviceType: "Video editing",
      offers: EDITZ_SERVICE_LINKS.map((l) => l.name),
    },
  }
}
