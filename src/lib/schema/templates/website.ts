import { DEFAULT_IN_LANGUAGE, getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface WebSiteTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
  description?: string
  keywords?: string[]
}

/**
 * Creates WebSite schema.
 * Emitted ONLY on Homepage (@id #website).
 * Includes publisher -> #organization and potentialAction SearchAction.
 */
export function createWebSiteSchema(options: WebSiteTemplateOptions): Record<string, any> {
  const { baseUrl, profile, description, keywords } = options
  const websiteId = getEntityId(baseUrl, "#website")
  const orgId = getEntityId(baseUrl, "#organization")

  const siteNode: Record<string, any> = {
    "@type": "WebSite",
    "@id": websiteId,
    name: profile.name,
    alternateName: profile.alternateName || profile.name,
    url: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
    description: description || "Mommantum — Performance Marketing and Growth Studio",
    inLanguage: DEFAULT_IN_LANGUAGE,
    publisher: {
      "@id": orgId,
    },
  }

  if (keywords && keywords.length > 0) {
    siteNode.keywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6).join(", ")
  }

  return siteNode
}

/**
 * Compact WebSite node for every non-home page (@id, url, name, publisher), so each page's
 * isPartOf reference resolves inside its own graph.
 */
export function createCompactWebSiteSchema(options: { baseUrl: string; profile: OrganizationProfile }): Record<string, any> {
  const { baseUrl, profile } = options
  return {
    "@type": "WebSite",
    "@id": getEntityId(baseUrl, "#website"),
    url: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
    name: profile.name,
    inLanguage: DEFAULT_IN_LANGUAGE,
    publisher: { "@id": getEntityId(baseUrl, "#organization") },
  }
}
