/**
 * Breadcrumbs follow the page's real position in the site (Google BreadcrumbList guidance).
 * Lists of latest services / case studies / posts are emitted as a dynamic ItemList on the
 * collection pages instead of being packed into the breadcrumb.
 */
import { describe, it, expect } from "vitest"
import { generateSchemaGraph } from "../generate-graph"
import { resolveHomepageData, resolveEditzData, resolveLegalPageData } from "../resolvers/page"
import { resolveCollectionData } from "../resolvers/collection"
import { resolveServiceData } from "../resolvers/service"
import { resolveCaseStudyData } from "../resolvers/case-study"

const BASE = "https://www.agpower.in"

const crumbs = (graph: any) =>
  graph["@graph"].find((n: any) => n.breadcrumb).breadcrumb.itemListElement.map((i: any) => ({
    name: i.name,
    item: i.item,
  }))

const itemList = (graph: any) => graph["@graph"].find((n: any) => n["@type"] === "ItemList")

const SERVICES = [
  { title: "Performance Marketing", slug: "performance-marketing" },
  { title: "Search Engine Optimization", slug: "search-engine-optimization" },
  { title: "AI Automation", slug: "ai-automation" },
]

const CASE_STUDIES = [
  { title: "The Kids Store", slug: "the-kids-store", published_at: "2026-01-01T00:00:00Z" },
  { title: "Urban Vada Pav", slug: "urban-vada-pav", published_at: "2026-03-01T00:00:00Z" },
]

const POSTS = [
  { title: "Older post", slug: "older-post", published_at: "2026-05-26T09:56:12Z" },
  { title: "Newest post", slug: "newest-post", published_at: "2026-07-02T11:01:40Z" },
  { title: "Middle post", slug: "middle-post", published_at: "2026-06-01T00:00:00Z" },
]

describe("Breadcrumbs = site hierarchy; collections carry a dynamic ItemList", () => {
  it("Home: a single 'Home' crumb", async () => {
    const graph = await generateSchemaGraph(resolveHomepageData(null))
    expect(crumbs(graph)).toEqual([{ name: "Home", item: `${BASE}/` }])
  })

  it("/services: Home › Services, plus an ItemList of every service", async () => {
    const graph = await generateSchemaGraph(resolveCollectionData({ section: "services", items: SERVICES }))
    expect(crumbs(graph).map((c: any) => c.name)).toEqual(["Home", "Services"])
    const list = itemList(graph)
    expect(list.itemListElement.map((i: any) => i.url)).toEqual(SERVICES.map((s) => `${BASE}/services/${s.slug}`))
  })

  it("/work: Home › Case Studies, ItemList shows the latest case study first", async () => {
    const graph = await generateSchemaGraph(resolveCollectionData({ section: "work", items: CASE_STUDIES }))
    expect(crumbs(graph).map((c: any) => c.name)).toEqual(["Home", "Case Studies"])
    expect(itemList(graph).itemListElement[0].name).toBe("Urban Vada Pav")
  })

  it("/blog: Home › Blog, ItemList newest post first", async () => {
    const graph = await generateSchemaGraph(resolveCollectionData({ section: "blog", items: POSTS }))
    expect(crumbs(graph).map((c: any) => c.name)).toEqual(["Home", "Blog"])
    expect(itemList(graph).itemListElement.map((i: any) => i.name)).toEqual(["Newest post", "Middle post", "Older post"])
  })

  it("/editz: Home › Editz with a Service node listing the EDITZ offers", async () => {
    const graph = await generateSchemaGraph(resolveEditzData(null))
    expect(crumbs(graph)).toEqual([
      { name: "Home", item: `${BASE}/` },
      { name: "Editz", item: `${BASE}/editz` },
    ])
    const service = graph["@graph"].find((n: any) => n["@type"] === "Service")
    expect(service).toBeDefined()
    expect(service?.hasOfferCatalog?.itemListElement.length).toBeGreaterThan(0)
  })

  it("/services/[slug]: Home › Services › Service (no extra crumbs)", async () => {
    const graph = await generateSchemaGraph(
      resolveServiceData({
        slug: "performance-marketing",
        title: "Performance Marketing",
        shortLabel: "Performance",
        description: "Ads that scale.",
        intro: "",
        image: "",
        points: [],
        outcomes: [],
        whyItMatters: [],
        faqs: [],
      })
    )
    expect(crumbs(graph).map((c: any) => c.name)).toEqual(["Home", "Services", "Performance Marketing"])
  })

  it("/work/[slug]: Home › Case Studies › Case study", async () => {
    const graph = await generateSchemaGraph(
      resolveCaseStudyData({ slug: "the-kids-store", title: "The Kids Store" } as any)
    )
    expect(crumbs(graph).map((c: any) => c.name)).toEqual(["Home", "Case Studies", "The Kids Store"])
  })

  it("/blog-ai: Home › Blog AI with a Service node", async () => {
    const graph = await generateSchemaGraph(resolveLegalPageData("blog-ai", "Blog AI", "desc"))
    expect(crumbs(graph).length).toBe(2)
    expect(graph["@graph"].some((n: any) => n["@type"] === "Service")).toBe(true)
  })
})
