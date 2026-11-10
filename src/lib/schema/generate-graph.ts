import { buildSchemaGraph } from "./build-graph"
import { getEntityId } from "./config"
import { getSchemaSite, SchemaSiteInfo } from "./site"
import { ResolvedData } from "./resolvers/types"
import { createCompactOrganizationSchema, createOrganizationSchema, toAreaServed } from "./templates/organization"
import { createCompactWebSiteSchema, createWebSiteSchema } from "./templates/website"
import { createFounderPersonSchema, getFounderId, isFounderName } from "./templates/person"
import { createCaseStudySchema } from "./templates/case-study"
import { createBreadcrumbSchema } from "./templates/breadcrumb"
import { createWebPageSchema } from "./templates/webpage"
import { createBlogPostingSchema } from "./templates/blog-posting"
import { createFAQSchema } from "./templates/faq"
import { createItemListSchema } from "./templates/item-list"
import { createServiceSchema } from "./templates/service"

export type SchemaPageType = "home" | "page" | "collection" | "blog_post" | "case_study"

/**
 * Allowed top-level nodes per page type. BreadcrumbList and FAQPage are nested inside the
 * WebPage node (WebPage.breadcrumb / WebPage.hasPart), so each page has one connected graph.
 * Home carries the full Organization (+ProfessionalService) and WebSite; every other page
 * carries compact Organization and WebSite nodes so its @id references resolve in-page.
 */
export const ALLOWED_SCHEMA_MATRIX: Record<SchemaPageType, string[]> = {
  home: ["WebSite", "Organization", "Person", "WebPage", "BreadcrumbList"],
  page: ["WebPage", "AboutPage", "ContactPage", "FAQPage", "Service", "Person", "Organization", "WebSite", "BreadcrumbList"],
  collection: ["CollectionPage", "ItemList", "Organization", "WebSite", "BreadcrumbList"],
  blog_post: ["BlogPosting", "WebPage", "Person", "Organization", "WebSite", "BreadcrumbList"],
  case_study: ["WebPage", "Article", "Organization", "WebSite", "BreadcrumbList"],
}

/**
 * Page type detection:
 * - home: /
 * - collection: /services, /work, /blog (CollectionPage + dynamic ItemList)
 * - blog_post: /blog/[slug]
 * - case_study: /work/[slug] (WebPage + Article)
 * - page: everything else (about, contact, faq, legal, service details, EDITZ, Blog AI)
 */
export function detectPageType(resolved: ResolvedData): SchemaPageType {
  if (resolved.contentType === "homepage") return "home"
  if (resolved.contentType === "blog") return "blog_post"
  if (resolved.contentType === "collection") return "collection"
  if (resolved.contentType === "case-study") return "case_study"
  return "page"
}

/**
 * Safety filter: drops any node whose @type is not in the allow-list for the current page type,
 * and de-duplicates by @id and @type.
 */
export function filterAndDeduplicateNodes(
  nodes: Array<Record<string, any> | null | undefined>,
  pageType: SchemaPageType
): Array<Record<string, any>> {
  const allowedTypes = new Set(ALLOWED_SCHEMA_MATRIX[pageType] || [])
  const seenIds = new Set<string>()
  const seenTypes = new Set<string>()
  const filtered: Array<Record<string, any>> = []

  for (const node of nodes) {
    if (!node || typeof node !== "object") continue

    const rawType = node["@type"]
    // Handle array types e.g. ["Organization", "Thing"]
    const types = Array.isArray(rawType) ? rawType : [rawType]
    const isAllowed = types.some((t) => allowedTypes.has(t))

    if (!isAllowed) {
      continue
    }

    const id = node["@id"]
    if (id && seenIds.has(id)) {
      continue
    }

    const primaryType = types[0]
    if (seenTypes.has(primaryType)) {
      continue
    }

    if (id) seenIds.add(id)
    seenTypes.add(primaryType)
    filtered.push(node)
  }

  return filtered
}

/**
 * Builds the schema graph for any page type.
 * Enforces:
 * - One page type = one fixed set of schema nodes (ALLOWED_SCHEMA_MATRIX).
 * - FAQPage is only nested inside WebPage.hasPart (never standalone in @graph).
 * - Full WebSite and Organization/ProfessionalService nodes exist ONLY on the home page;
 *   every other page carries compact versions with the same @id.
 * - The founder Person (#founder) is emitted on home, /about and on posts he wrote.
 * - No ElectronicsStore, Review, aggregateRating, or unlisted nodes.
 */
export async function generateSchemaGraph(
  resolved: ResolvedData,
  siteInfoOverride?: SchemaSiteInfo
): Promise<{
  "@context": string
  "@graph": Array<Record<string, any>>
}> {
  const siteInfo = siteInfoOverride || (await getSchemaSite())
  const { baseUrl, profile } = siteInfo
  const pageType = detectPageType(resolved)

  const rawNodes: Array<Record<string, any> | null | undefined> = []

  // Build nested FAQPage node if valid FAQs exist on page
  const faqNode =
    resolved.faqs && resolved.faqs.length > 0
      ? createFAQSchema({
          pageUrl: resolved.canonicalUrl,
          faqs: resolved.faqs,
        })
      : null

  // Breadcrumbs (Home on home, Home > ... on other pages)
  const breadcrumbItems =
    resolved.breadcrumbs && resolved.breadcrumbs.length > 0
      ? resolved.breadcrumbs
      : [{ name: "Home", url: `${baseUrl}/` }]

  const breadcrumbNode = createBreadcrumbSchema({
    pageUrl: resolved.canonicalUrl,
    items: breadcrumbItems,
  })

  switch (pageType) {
    case "home": {
      // EXACTLY 3 NODES: WebSite, Organization, WebPage (with nested FAQPage + nested BreadcrumbList)
      const websiteNode = createWebSiteSchema({
        baseUrl,
        profile,
        description: resolved.description,
        keywords: resolved.keywords,
      })
      rawNodes.push(websiteNode)

      const orgNode = createOrganizationSchema({
        baseUrl,
        profile,
        full: true,
        keywords: resolved.keywords,
      })
      rawNodes.push(orgNode)
      rawNodes.push(createFounderPersonSchema({ baseUrl, profile }))

      const webPageNode = createWebPageSchema({
        type: "WebPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)

      break
    }

    case "page": {
      // WebPage subtype (nested FAQPage + BreadcrumbList), optional Service, founder on /about
      let subtype: "WebPage" | "AboutPage" | "ContactPage" = "WebPage"
      if (resolved.contentType === "about") subtype = "AboutPage"
      else if (resolved.contentType === "contact") subtype = "ContactPage"


      const webPageNode = createWebPageSchema({
        type: subtype,
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        keywords: resolved.keywords,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)

      if (resolved.contentType === "about") {
        rawNodes.push(createFounderPersonSchema({ baseUrl, profile }))
      }

      if (resolved.primaryService) {
        rawNodes.push(
          createServiceSchema({
            pageUrl: resolved.canonicalUrl,
            baseUrl,
            name: resolved.primaryService.name,
            description: resolved.primaryService.description,
            image: resolved.image,
            serviceType: resolved.primaryService.serviceType,
            areaServed: toAreaServed(["India"]),
            deliverables: resolved.primaryService.offers,
            keywords: resolved.keywords,
          })
        )
      }
      break
    }

    case "blog_post": {
      // BlogPosting, WebPage (nested FAQPage + BreadcrumbList), founder Person if he wrote it
      const byFounder = isFounderName(resolved.authorName, profile)
      const blogPostingNode = createBlogPostingSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        headline: resolved.headline || resolved.title,
        description: resolved.description,
        image: resolved.image,
        authorName: resolved.authorName,
        authorId: byFounder ? getFounderId(baseUrl) : undefined,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        articleSection: resolved.articleSection,
        keywords: resolved.keywords,
        wordCount: resolved.wordCount,
        isPartOf: resolved.isPartOf,
      })
      rawNodes.push(blogPostingNode)
      if (byFounder) rawNodes.push(createFounderPersonSchema({ baseUrl, profile }))

      const webPageNode = createWebPageSchema({
        type: "WebPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        mainEntityId: getEntityId(resolved.canonicalUrl, "#article"),
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)

      break
    }

    case "case_study": {
      // WebPage (nested FAQPage + BreadcrumbList) whose main entity is the case-study Article
      rawNodes.push(
        createWebPageSchema({
          type: "WebPage",
          pageUrl: resolved.canonicalUrl,
          baseUrl,
          name: resolved.title,
          description: resolved.description,
          image: resolved.image,
          datePublished: resolved.datePublished,
          dateModified: resolved.dateModified,
          keywords: resolved.keywords,
          mainEntityId: getEntityId(resolved.canonicalUrl, "#article"),
          hasPart: faqNode,
          includeWebSite: true,
          breadcrumb: breadcrumbNode,
        })
      )
      rawNodes.push(
        createCaseStudySchema({
          pageUrl: resolved.canonicalUrl,
          baseUrl,
          headline: resolved.headline || resolved.clientName || resolved.title,
          clientName: resolved.clientName,
          description: resolved.description,
          image: resolved.image,
          datePublished: resolved.datePublished,
          dateModified: resolved.dateModified,
          relatedServiceId: resolved.relatedServiceId,
          keywords: resolved.keywords,
        })
      )
      break
    }

    case "collection": {
      // CollectionPage (nested FAQPage + BreadcrumbList) and an ItemList of the latest items
      const collectionPageNode = createWebPageSchema({
        type: "CollectionPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        mainEntityId: (resolved.collectionItems || []).length ? getEntityId(resolved.canonicalUrl, "#itemlist") : undefined,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(collectionPageNode)

      const listItems = resolved.collectionItems || []
      if (listItems.length === 0) break
      const itemListNode = createItemListSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        items: listItems.map((it) => ({
          name: it.name,
          url: it.url,
        })),
      })
      rawNodes.push(itemListNode)

      break
    }
  }

  if (pageType !== "home") {
    rawNodes.push(createCompactOrganizationSchema({ baseUrl, profile }))
    rawNodes.push(createCompactWebSiteSchema({ baseUrl, profile }))
  }

  // Safety filter and deduplication enforcing matrix
  const cleanNodes = filterAndDeduplicateNodes(rawNodes, pageType)
  return buildSchemaGraph(cleanNodes)
}
