import { Metadata } from "next"
import type { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL } from "../config"

export interface BreadcrumbEntry {
  name: string
  url: string
}

export interface FAQEntry {
  question: string
  answer: string
}

export interface ResolvedData {
  contentType:
    | "homepage"
    | "about"
    | "contact"
    | "service"
    | "blog"
    | "case-study"
    | "collection"
    | "page"
    | "editz"
  title: string
  description: string
  canonicalUrl: string
  image?: string
  keywords?: string[]
  datePublished?: string
  dateModified?: string
  breadcrumbs: BreadcrumbEntry[]
  faqs?: FAQEntry[]
  // Service extras
  serviceType?: string
  deliverables?: string[]
  offers?: {
    price: number | string
    priceCurrency: string
    url?: string
  }
  // Blog extras
  headline?: string
  authorName?: string
  articleSection?: string
  wordCount?: number
  isPartOf?: Record<string, any>
  tags?: string[]
  // Case study extras
  clientName?: string
  relatedServiceId?: string
  // Collection extras
  collectionType?: "CollectionPage" | "Blog"
  collectionItems?: Array<{ name: string; url: string; image?: string }>
  /** The page's meta object; every override (OG, Twitter, robots, canonical, alt) is read from it. */
  seo?: SeoSetting | null
  /** Emits a Service node (service pages, EDITZ, Blog AI). */
  primaryService?: { name: string; description?: string; serviceType?: string; offers?: string[] }
}

function absolute(url: string | null | undefined): string | undefined {
  if (!url || !url.trim()) return undefined
  const value = url.trim()
  if (/^https?:\/\//i.test(value)) return value
  return `${DEFAULT_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`
}

/**
 * Only images whose real size is known to be 1200x630 claim width/height in og:image:
 * the /og/ share images, the service images under /images/services/, and the root
 * opengraph-image.jpg (all verified 1200x630). Other images omit the dimensions.
 */
export function isKnown1200x630(url: string): boolean {
  const path = url.replace(/^https?:\/\/[^/]+/i, "").split("?")[0]
  return path.startsWith("/og/") || path.startsWith("/images/services/") || path === "/opengraph-image.jpg"
}

/** Staging / preview deployments must never be indexed. */
export function isNonProductionDeployment(): boolean {
  return process.env.NEXT_PUBLIC_NOINDEX === "true" || process.env.VERCEL_ENV === "preview"
}

/**
 * Builds Next.js Metadata from ResolvedData + the page's meta object, so <head> and the
 * JSON-LD graph come from the same values (decision D-06). Empty meta-object fields fall
 * back to the page's own title, description and image.
 */
export function buildMetadataFromResolved(resolved: ResolvedData): Metadata {
  const seo = resolved.seo || null
  const isArticle = resolved.contentType === "blog" || resolved.contentType === "case-study"
  const canonical = absolute(seo?.canonical_url) || resolved.canonicalUrl
  const ogTitle = seo?.og_title || resolved.title
  const ogDescription = seo?.og_description || resolved.description
  const ogImage = absolute(seo?.og_image) || absolute(resolved.image) || `${DEFAULT_BASE_URL}/opengraph-image.jpg`
  const imageAlt = seo?.og_image_alt || seo?.image_alt || resolved.title
  const twitterImage = absolute(seo?.twitter_image) || ogImage
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE
  const indexable = !isNonProductionDeployment() && (seo?.robots_index ?? true)

  return {
    metadataBase: new URL(DEFAULT_BASE_URL),
    title: resolved.title,
    description: resolved.description,
    applicationName: "AG POWER",
    keywords: resolved.keywords && resolved.keywords.length ? resolved.keywords : undefined,
    alternates: { canonical },
    robots: {
      index: indexable,
      follow: indexable && (seo?.robots_follow ?? true),
      googleBot: {
        index: indexable,
        follow: indexable && (seo?.robots_follow ?? true),
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: absolute(seo?.og_url) || canonical,
      siteName: "AG POWER",
      locale: "en_IN",
      type: isArticle ? "article" : "website",
      ...(resolved.contentType === "blog"
        ? {
            publishedTime: resolved.datePublished,
            modifiedTime: resolved.dateModified,
            authors: resolved.authorName ? [resolved.authorName] : undefined,
            section: resolved.articleSection,
            tags: resolved.keywords && resolved.keywords.length ? resolved.keywords : undefined,
          }
        : {}),
      images: [
        isKnown1200x630(ogImage)
          ? { url: ogImage, width: 1200, height: 630, alt: imageAlt }
          : { url: ogImage, alt: imageAlt },
      ],
    },
    twitter: {
      card: seo?.twitter_card === "summary" ? "summary" : "summary_large_image",
      title: seo?.twitter_title || ogTitle,
      description: seo?.twitter_description || ogDescription,
      images: [{ url: twitterImage, alt: imageAlt }],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
  }
}
