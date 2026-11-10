import { SeoSetting } from "@lib/data/seo"
import { getPageFaqs } from "@lib/data/page-faqs"
import { DEFAULT_BASE_URL } from "../config"
import { getPageMetaDefault } from "../page-defaults"
import { pageShareImage } from "./page"
import { devWarn } from "../validate"
import { ResolvedData } from "./types"

export interface CollectionItemInput {
  name?: string
  title?: string
  slug?: string
  handle?: string
  published_at?: string | null
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

// Phase 4: Removed store collection option from schema resolver; retained services, work, blog.
export function resolveCollectionData(options: {
  section: "services" | "work" | "blog"
  items: CollectionItemInput[]
  seoSetting?: SeoSetting | null
}): ResolvedData {
  const { section, items, seoSetting } = options

  const defaultMeta = getPageMetaDefault(section)

  const sectionConfig = {
    services: {
      title: defaultMeta?.title || "Marketing, SEO, Web and AI Services | Mommantum Jaipur",
      description:
        defaultMeta?.description ||
        "Explore Mommantum services: performance marketing, SEO, social media, branding, web and app development, AI automation, AI agents and video production.",
      path: "/services",
      name: "Services",
      collectionType: "CollectionPage" as const,
      prefix: "/services/",
    },
    work: {
      title: defaultMeta?.title || "Case Studies | Mommantum Client Work and Growth Results",
      description:
        defaultMeta?.description ||
        "See how Mommantum helps brands grow. Browse case studies across ecommerce, SEO, web development and creative systems, with real strategy and results.",
      path: "/work",
      name: "Case Studies",
      collectionType: "CollectionPage" as const,
      prefix: "/work/",
    },
    blog: {
      title: defaultMeta?.title || "Mommantum Blog | SEO, Marketing and AI Growth Playbooks",
      description:
        defaultMeta?.description ||
        "Read practical guides from the Mommantum team on SEO, performance marketing, AI automation and scaling D2C brands, written for founders and marketers.",
      path: "/blog",
      name: "Blog",
      collectionType: "Blog" as const,
      prefix: "/blog/",
    },
  }[section]

  const canonicalUrl = `${DEFAULT_BASE_URL}${sectionConfig.path}`
  const title = seoSetting?.meta_title || sectionConfig.title
  const description = seoSetting?.meta_description || sectionConfig.description
  const image = seoSetting?.og_image || pageShareImage(section)

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[${section}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  // Blog and case-study lists show the latest items first (dynamic, from the database).
  const ordered =
    section === "services"
      ? items
      : [...items].sort((a, b) => {
          const ta = a.published_at ? Date.parse(a.published_at) : 0
          const tb = b.published_at ? Date.parse(b.published_at) : 0
          return tb - ta
        })

  const collectionItems = ordered
    .filter((it) => (it.slug || it.handle) && (it.title || it.name))
    .slice(0, 30)
    .map((it) => ({
      name: (it.title || it.name) as string,
      url: `${DEFAULT_BASE_URL}${sectionConfig.prefix}${it.slug || it.handle}`,
    }))

  // Breadcrumb = position in the site (Home › Section). The items live in the ItemList.
  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: sectionConfig.name, url: canonicalUrl },
  ]

  // Sourced FAQs: agency collection pages get 8-10 FAQs from page-faqs
  const faqs = getPageFaqs(section, seoSetting)

  return {
    contentType: "collection",
    seo: seoSetting ?? null,
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs,
    collectionType: sectionConfig.collectionType,
    collectionItems,
  }
}
