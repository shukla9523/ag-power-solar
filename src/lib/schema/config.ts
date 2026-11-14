export const SCHEMA_CONTEXT = "https://schema.org"
export const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.agpower.in"
export const DEFAULT_IN_LANGUAGE = "en-IN"


/** Video services shown under the Editz page (same links as the NavBar video-services list). */
export const EDITZ_SERVICE_LINKS: Array<{ name: string; path: string }> = [
  { name: "AI Video Generation", path: "/services/ai-video-generation" },
  { name: "Content and Video Scripting", path: "/services/content-video-scripting" },
  { name: "Video Editing", path: "/services/video-editing" },
  { name: "AI Video Editing", path: "/services/ai-video-editing" },
  { name: "Podcast Editing", path: "/services/podcast-editing" },
  { name: "Motion Graphics", path: "/services/motion-graphics" },
]


export type SchemaContentType =
  | "homepage"
  | "about"
  | "contact"
  | "service"
  | "blog"
  | "case-study"
  | "collection"
  | "page"
  | "editz"

/**
 * Normalizes a base URL to always start with https and end with a single slash.
 * Replaces localhost or empty values with DEFAULT_BASE_URL.
 */
export function normalizeBaseUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return `${DEFAULT_BASE_URL}/`
  }
  let url = rawUrl.trim()
  if (url.includes("localhost") || url.includes("127.0.0.1") || !url.startsWith("http")) {
    return `${DEFAULT_BASE_URL}/`
  }
  if (!url.endsWith("/")) {
    url = `${url}/`
  }
  return url.replace(/\/+$/, "/")
}

/**
 * Normalizes an absolute URL for a page or asset.
 * Replaces localhost with DEFAULT_BASE_URL.
 */
export function normalizeUrl(urlOrPath: string, baseUrl: string = DEFAULT_BASE_URL): string {
  if (!urlOrPath) return normalizeBaseUrl(baseUrl)
  const trimmed = urlOrPath.trim()
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
      const baseClean = normalizeBaseUrl(baseUrl).replace(/\/+$/, "")
      return trimmed.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, baseClean)
    }
    return trimmed
  }
  const base = normalizeBaseUrl(baseUrl).replace(/\/+$/, "")
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

/**
 * Standardized entity IDs adhering to:
 * - {base}/#organization
 * - {base}/#website
 * - {base}/#logo
 * - {base}/#founder
 * - {pageUrl}#webpage
 * - {pageUrl}#breadcrumb
 * - {pageUrl}#service
 * - {pageUrl}#article
 * - {pageUrl}#faq
 * - {pageUrl}#collection
 */
export function getEntityId(targetUrl: string, suffix: string): string {
  const cleanSuffix = suffix.startsWith("#") ? suffix : `#${suffix}`
  const baseOrPage = targetUrl.trim()
  // If targetUrl ends with '/', e.g. 'https://www.mommantum.com/', format is 'https://www.mommantum.com/#suffix'
  // If targetUrl has a path without slash, e.g. 'https://www.mommantum.com/services/seo', format is '...#suffix'
  return `${baseOrPage}${cleanSuffix}`
}
