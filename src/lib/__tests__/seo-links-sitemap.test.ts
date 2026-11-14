/**
 * Purpose: tests for the SEO plumbing around the schema graph — anchor variety in the
 * internal linker, first-match-only case-study links, og:image dimensions, the services
 * sitemap fallback when the database is empty or failing, and the /llms.txt route.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"

// Every Supabase query fails, as it does when the DB is unreachable.
const failingQuery: any = {
  select: () => failingQuery,
  eq: () => failingQuery,
  is: () => failingQuery,
  order: () => failingQuery,
  then: (resolve: (v: unknown) => unknown) => resolve({ data: null, error: { message: "offline" } }),
}
vi.mock("@lib/supabase-admin", () => ({ supabaseAdmin: { from: () => failingQuery } }))
vi.mock("@lib/seo/seo-store", () => ({ listSeoRows: async () => [] }))

import { injectInternalLinks } from "../util/linker"
import { enrichServiceFocusContent } from "../data/service-focus"
import { buildMetadataFromResolved, isKnown1200x630 } from "../schema/resolvers/types"
import { resolveAboutData, resolveCaseStudyData } from "../schema/resolvers"
import { clearPageRegistry, getPageRegistry } from "../seo/page-registry"
import { FALLBACK_SERVICES } from "../data/fallback-services"

describe("Internal linker anchor variety", () => {
  const links = [
    { keyword: "performance marketing agency", target_url: "/services/performance-marketing", alternatives: ["Meta ads management", "paid ads"] },
  ]

  it("uses whichever of the target's phrases appears first, linking the target once", () => {
    const out = injectInternalLinks("<p>We handle paid ads daily. A performance marketing agency helps.</p>", links, { currentPath: "/blog/x" })
    expect(out).toBe('<p>We handle <a href="/services/performance-marketing">paid ads</a> daily. A performance marketing agency helps.</p>')
  })

  it("still uses the primary keyword when it is the first mention", () => {
    const out = injectInternalLinks("<p>A performance marketing agency runs paid ads.</p>", links, { currentPath: "/blog/x" })
    expect(out).toContain('<a href="/services/performance-marketing">performance marketing agency</a>')
    expect((out.match(/<a /g) || []).length).toBe(1)
  })

  it("never links alternatives inside headings", () => {
    const html = "<h2>Paid ads</h2><p>Nothing else here.</p>"
    expect(injectInternalLinks(html, links, { currentPath: "/blog/x" })).toBe(html)
  })
})

describe("Service focus case-study links", () => {
  it("links each case study and the /work hub on the first match only", () => {
    const text = "See our case studies. Read the Jalvayu Wellness case study. More case studies and the Jalvayu Wellness case study again."
    const out = enrichServiceFocusContent(text, "seo")
    expect(out.match(/href="\/work"/g)?.length).toBe(1)
    expect(out.match(/href="\/work\/jalvayu-wellness"/g)?.length).toBe(1)
  })

  it("leaves mentions of unknown case-study slugs as plain text", () => {
    const out = enrichServiceFocusContent("Read the Urban Vada Pav case study.", "seo", undefined, { knownCaseStudySlugs: ["the-kids-store"] })
    expect(out).not.toContain("<a ")
  })

  it("shares used targets across blocks so a page links /work once", () => {
    const usedTargets = new Set<string>()
    const a = enrichServiceFocusContent("Our case studies.", "seo", undefined, { usedTargets })
    const b = enrichServiceFocusContent("More case studies.", "seo", undefined, { usedTargets })
    expect(a).toContain('href="/work"')
    expect(b).not.toContain("<a ")
  })
})

describe("og:image dimensions", () => {
  it("defaults static pages to their /og/pages share image with 1200x630", () => {
    const resolved = resolveAboutData(null)
    expect(resolved.image).toBe("https://www.agpower.in/og/pages/about.jpg")
    const meta = buildMetadataFromResolved(resolved)
    expect((meta.openGraph as any).images[0]).toMatchObject({ width: 1200, height: 630 })
  })

  it("omits width/height for images of unknown size", () => {
    const resolved = resolveCaseStudyData({
      slug: "the-kids-store", category: "Ecommerce", title: "The Kids Store", challenge: "CAC",
      image: "/images/kids.webp", whatWeDid: [], results: [], metrics: [],
    })
    const img = (buildMetadataFromResolved(resolved).openGraph as any).images[0]
    expect(img.width).toBeUndefined()
    expect(img.height).toBeUndefined()
  })

  it("recognises the verified 1200x630 locations", () => {
    expect(isKnown1200x630("https://www.agpower.in/og/services/seo.jpg")).toBe(true)
    expect(isKnown1200x630("/images/services/performance-marketing.webp")).toBe(true)
    expect(isKnown1200x630("https://cdn.example.com/blog/post.webp")).toBe(false)
  })
})

describe("Page registry fallback", () => {
  beforeEach(() => clearPageRegistry())

  it("lists the built-in services when the database fails, so the services sitemap is never empty", async () => {
    const pages = await getPageRegistry()
    const services = pages.filter((p) => p.kind === "service")
    expect(services.length).toBe(Object.keys(FALLBACK_SERVICES).length)
    expect(services.map((s) => s.path)).toContain("/services/residential-solar")
    // Blog fallback provides verified educational solar articles
    expect(pages.filter((p) => p.kind === "blog").length).toBeGreaterThanOrEqual(1)
    expect(pages.find((p) => p.path === "/about")?.image).toBe("/og/pages/about.jpg")
  })
})

describe("/llms.txt", () => {
  beforeEach(() => clearPageRegistry())

  it("returns plain text with the company summary, services and key pages as absolute URLs", async () => {
    const { GET } = await import("../../app/llms.txt/route")
    const res = await GET()
    expect(res.headers.get("Content-Type")).toContain("text/plain")
    const body = await res.text()
    expect(body.startsWith("# AG POWER")).toBe(true)
    expect(body).toContain("https://www.agpower.in/services/residential-solar")
    for (const path of ["/about", "/calculator", "/solar-panels", "/customer-services", "/faq", "/blog", "/contact"]) {
      expect(body).toContain(`(https://www.agpower.in${path})`)
    }
    expect(body).toContain("contact@agpower.in")
  })
})
