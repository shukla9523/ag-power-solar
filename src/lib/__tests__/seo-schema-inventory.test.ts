/**
 * Purpose: schema inventory. Builds the JSON-LD graph for every page type with
 * representative data and pins the exact top-level node @types and nested node @types per
 * page, plus the set of distinct schema types used across the site. A change to any page's
 * structured data shows up here as a reviewed diff.
 * Set SCHEMA_INVENTORY_OUT=<file> to also write the inventory as JSON (for reports).
 */
import { describe, it, expect } from "vitest"
import { writeFileSync } from "fs"
import { generateSchemaGraph } from "../schema/generate-graph"
import { verifyGraphIdReferences, verifyNoForbiddenEntities } from "../schema/validate"
import { DEFAULT_ORGANIZATION_PROFILE } from "../schema/site"
import { DEFAULT_BASE_URL, normalizeBaseUrl } from "../schema/config"
import {
  ResolvedData,
  resolveAboutData,
  resolveBlogData,
  resolveCaseStudyData,
  resolveCollectionData,
  resolveContactData,
  resolveEditzData,
  resolveHomepageData,
  resolveLegalPageData,
  resolveServiceData,
} from "../schema/resolvers"

const site = { baseUrl: normalizeBaseUrl(DEFAULT_BASE_URL), profile: DEFAULT_ORGANIZATION_PROFILE, siteSetting: null }

const service = {
  slug: "performance-marketing",
  title: "Performance Marketing",
  shortLabel: "Performance",
  description: "Scale revenue with Meta and Google ads.",
  intro: "Intro",
  image: "/og/services/performance-marketing.jpg",
  points: ["Meta Ads management", "Google Ads management"],
  outcomes: ["Lower CAC"],
  whyItMatters: [],
  faqs: [{ question: "Which platforms?", answer: "Meta and Google." }],
}

const post = {
  id: "p1",
  slug: "scale-d2c",
  title: "Scaling D2C Brands in India",
  category_id: "Growth",
  featured_image: "/blog/d2c.webp",
  image_urls: [],
  excerpt: "Guide.",
  content: "<p>Body</p>",
  author_name: "Kuldeep Ahir",
  status: "published",
  published_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-02T00:00:00Z",
  meta_title: null,
  meta_description: null,
  faqs: [{ question: "Is this for D2C?", answer: "Yes." }],
}

const study = {
  slug: "the-kids-store",
  category: "Ecommerce · PPC",
  title: "The Kids Store",
  challenge: "High CAC",
  image: "/images/kids.webp",
  whatWeDid: ["Ads"],
  results: ["Conversion grew"],
  metrics: [],
}

const PAGES: Record<string, () => ResolvedData> = {
  home: () => resolveHomepageData(null),
  about: () => resolveAboutData(null),
  contact: () => resolveContactData(null),
  faq: () => resolveLegalPageData("faq", "FAQ", "FAQ", null, [{ question: "Q?", answer: "A." }]),
  legal: () => resolveLegalPageData("privacy-policy", "Privacy Policy", "Privacy"),
  "blog-ai": () => resolveLegalPageData("blog-ai", "Blog AI", "Blog AI"),
  editz: () => resolveEditzData(null),
  "services index": () => resolveCollectionData({ section: "services", items: [{ title: "Performance Marketing", slug: "performance-marketing" }] }),
  "service detail": () => resolveServiceData(service as any),
  "work index": () => resolveCollectionData({ section: "work", items: [{ title: "The Kids Store", slug: "the-kids-store" }] }),
  "case study": () => resolveCaseStudyData(study as any),
  "blog index": () => resolveCollectionData({ section: "blog", items: [{ title: post.title, slug: post.slug, published_at: post.published_at }] }),
  "blog post": () => resolveBlogData(post as any),
}

const ORG_FULL = ["Organization", "ProfessionalService"]
const COMPACT = ["Organization", "WebSite"]

/** Expected top-level @types (in graph order) and nested @types (sorted) per page type. */
const EXPECTED: Record<string, { top: string[]; nested: string[] }> = {
  home: {
    top: ["WebSite", ...ORG_FULL, "Person", "WebPage"],
    nested: ["Answer", "BreadcrumbList", "City", "ContactPoint", "Country", "FAQPage", "ImageObject", "ListItem", "OpeningHoursSpecification", "Place", "PostalAddress", "QuantitativeValue", "Question"],
  },
  about: { top: ["AboutPage", "Person", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  contact: { top: ["ContactPage", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  faq: { top: ["WebPage", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  legal: { top: ["WebPage", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  "blog-ai": { top: ["WebPage", "Service", ...COMPACT], nested: ["Answer", "BreadcrumbList", "Country", "FAQPage", "ImageObject", "ListItem", "Question"] },
  editz: {
    top: ["WebPage", "Service", ...COMPACT],
    nested: ["Answer", "BreadcrumbList", "Country", "FAQPage", "ImageObject", "ListItem", "Offer", "OfferCatalog", "Question", "Service"],
  },
  "services index": { top: ["CollectionPage", "ItemList", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  "service detail": {
    top: ["WebPage", "Service", ...COMPACT],
    nested: ["Answer", "BreadcrumbList", "Country", "FAQPage", "ImageObject", "ListItem", "Offer", "OfferCatalog", "Question", "Service"],
  },
  "work index": { top: ["CollectionPage", "ItemList", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  "case study": { top: ["WebPage", "Article", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Organization", "Question"] },
  "blog index": { top: ["CollectionPage", "ItemList", ...COMPACT], nested: ["Answer", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
  "blog post": { top: ["BlogPosting", "Person", "WebPage", ...COMPACT], nested: ["Answer", "Blog", "BreadcrumbList", "FAQPage", "ImageObject", "ListItem", "Question"] },
}

function typesOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  return typeof value === "string" ? [value] : []
}

function nestedTypes(node: Record<string, any>): string[] {
  const found = new Set<string>()
  const walk = (val: any) => {
    if (!val || typeof val !== "object") return
    if (Array.isArray(val)) return val.forEach(walk)
    typesOf(val["@type"]).forEach((t) => found.add(t))
    Object.values(val).forEach(walk)
  }
  Object.entries(node).forEach(([k, v]) => k !== "@type" && walk(v))
  return Array.from(found)
}

describe("Schema inventory per page type", () => {
  const inventory: Record<string, { top: string[]; nested: string[] }> = {}

  for (const [name, resolve] of Object.entries(PAGES)) {
    it(`${name}: emits the expected node types`, async () => {
      const graph = await generateSchemaGraph(resolve(), site)
      const nodes = graph["@graph"]
      const top = nodes.flatMap((n) => typesOf(n["@type"]))
      const nested = Array.from(new Set(nodes.flatMap(nestedTypes))).sort()
      inventory[name] = { top, nested }

      expect(top).toEqual(EXPECTED[name].top)
      expect(nested).toEqual(EXPECTED[name].nested)
      expect(verifyNoForbiddenEntities(nodes).valid).toBe(true)
      expect(verifyGraphIdReferences(nodes).valid).toBe(true)
      // Every page carries #organization and #website nodes
      expect(nodes.some((n) => n["@id"] === "https://www.mommantum.com/#organization")).toBe(true)
      expect(nodes.some((n) => n["@id"] === "https://www.mommantum.com/#website")).toBe(true)
    })
  }

  it("uses a fixed set of distinct schema types across the site", () => {
    const all = new Set<string>()
    for (const page of Object.values(EXPECTED)) [...page.top, ...page.nested].forEach((t) => all.add(t))
    expect(Array.from(all).sort()).toEqual([
      "AboutPage", "Answer", "Article", "Blog", "BlogPosting", "BreadcrumbList", "City", "CollectionPage",
      "ContactPage", "ContactPoint", "Country", "FAQPage", "ImageObject", "ItemList", "ListItem", "Offer",
      "OfferCatalog", "OpeningHoursSpecification", "Organization", "Person", "Place", "PostalAddress",
      "ProfessionalService", "QuantitativeValue", "Question", "Service", "WebPage", "WebSite",
    ])
    if (process.env.SCHEMA_INVENTORY_OUT) {
      writeFileSync(process.env.SCHEMA_INVENTORY_OUT, JSON.stringify({ inventory, distinct: Array.from(all).sort() }, null, 2))
    }
  })
})
