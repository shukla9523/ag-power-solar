import { describe, it, expect } from "vitest"
import { serializeJsonLd } from "../serialize"
import { isValidAbsoluteUrl, isValidIsoDate, verifyGraphIdReferences, verifyNoForbiddenEntities } from "../validate"
import { getEntityId, normalizeUrl, normalizeBaseUrl, DEFAULT_BASE_URL } from "../config"
import { cleanEmptyProperties, buildSchemaGraph } from "../build-graph"
import { DEFAULT_ORGANIZATION_PROFILE } from "../site"
import { resolveHomepageData, resolveServiceData, resolveBlogData, resolveCaseStudyData } from "../resolvers"
import { generateSchemaGraph } from "../generate-graph"

describe("Safe JSON-LD Serializer", () => {
  it("escapes </script> and <!-- to prevent script breakouts", () => {
    const malicious = {
      title: "</script><script>alert('xss')</script>",
      comment: "<!-- html comment -->",
    }
    const serialized = serializeJsonLd(malicious)
    expect(serialized).not.toContain("</script>")
    expect(serialized).not.toContain("<!--")
    expect(serialized).toContain("\\u003c/script\\u003e")
    expect(serialized).toContain("\\u003c!--")
  })

  it("escapes & and unicode line/paragraph separators U+2028 and U+2029", () => {
    const data = {
      text: "Ampersand & separators \u2028 and \u2029",
    }
    const serialized = serializeJsonLd(data)
    expect(serialized).toContain("\\u0026")
    expect(serialized).toContain("\\u2028")
    expect(serialized).toContain("\\u2029")
  })

  it("handles null and undefined gracefully", () => {
    expect(serializeJsonLd(null)).toBe("")
    expect(serializeJsonLd(undefined)).toBe("")
  })
})

describe("Validators", () => {
  it("validates absolute URLs correctly and disallows localhost", () => {
    expect(isValidAbsoluteUrl("https://www.agpower.in/services")).toBe(true)
    expect(isValidAbsoluteUrl("https://www.agpower.in/")).toBe(true)
    expect(isValidAbsoluteUrl("http://localhost:8000/services")).toBe(false)
    expect(isValidAbsoluteUrl("http://127.0.0.1:3000")).toBe(false)
    expect(isValidAbsoluteUrl("/services/seo")).toBe(false)
    expect(isValidAbsoluteUrl("")).toBe(false)
  })

  it("validates ISO-8601 date strings", () => {
    expect(isValidIsoDate("2025-12-15")).toBe(true)
    expect(isValidIsoDate("2026-05-26T10:25:38.396Z")).toBe(true)
    expect(isValidIsoDate("2026-05-26T10:25:38+05:30")).toBe(true)
    expect(isValidIsoDate("invalid-date")).toBe(false)
    expect(isValidIsoDate("2025/12/15")).toBe(false)
    expect(isValidIsoDate("")).toBe(false)
  })
})

describe("Entity ID and URL builders", () => {
  it("constructs correct entity IDs adhering to spec", () => {
    const base = "https://www.agpower.in/"
    expect(getEntityId(base, "#organization")).toBe("https://www.agpower.in/#organization")
    expect(getEntityId(base, "#website")).toBe("https://www.agpower.in/#website")
    expect(getEntityId(base, "#founder")).toBe("https://www.agpower.in/#founder")

    const pageUrl = "https://www.agpower.in/services/seo"
    expect(getEntityId(pageUrl, "#webpage")).toBe("https://www.agpower.in/services/seo#webpage")
    expect(getEntityId(pageUrl, "#service")).toBe("https://www.agpower.in/services/seo#service")
    expect(getEntityId(pageUrl, "#breadcrumb")).toBe("https://www.agpower.in/services/seo#breadcrumb")
  })

  it("normalizes localhost URLs to DEFAULT_BASE_URL", () => {
    expect(normalizeBaseUrl("http://localhost:8000")).toBe(`${DEFAULT_BASE_URL}/`)
    expect(normalizeUrl("/services", "http://localhost:8000")).toBe("https://www.agpower.in/services")
    expect(normalizeUrl("http://localhost:8000/logo.png")).toBe("https://www.agpower.in/logo.png")
  })
})

describe("Missing-field omission and cleanEmptyProperties", () => {
  it("drops null, undefined, empty strings, and empty arrays", () => {
    const dirty = {
      keep: "valid",
      emptyStr: "",
      emptyArr: [],
      nullVal: null,
      undefVal: undefined,
      nested: {
        validNested: "hello",
        emptyNestedStr: "",
      },
      emptyNestedObj: {
        onlyEmpty: "",
      },
    }
    const cleaned = cleanEmptyProperties(dirty)
    expect(cleaned).toEqual({
      keep: "valid",
      nested: {
        validNested: "hello",
      },
    })
    expect(cleaned).not.toHaveProperty("emptyStr")
    expect(cleaned).not.toHaveProperty("emptyArr")
    expect(cleaned).not.toHaveProperty("nullVal")
    expect(cleaned).not.toHaveProperty("undefVal")
    expect(cleaned).not.toHaveProperty("emptyNestedObj")
  })
})

describe("Graph Reference Checker and Forbidden Entities", () => {
  it("flags missing @id references in graph", () => {
    const brokenGraph = [
      {
        "@type": "WebPage",
        "@id": "https://www.agpower.in/#webpage",
        about: { "@id": "https://www.agpower.in/#nonexistent-org" },
      },
    ]
    const res = verifyGraphIdReferences(brokenGraph)
    expect(res.valid).toBe(false)
    expect(res.issues.length).toBeGreaterThan(0)
    expect(res.issues[0].message).toContain("nonexistent-org")
  })

  it("catches forbidden entities like Brand, aggregateRating, Review", () => {
    const invalidGraph = [
      {
        "@type": "Brand",
        "@id": "https://www.agpower.in/#brand",
        name: "Mommantum",
      },
      {
        "@type": "Service",
        "@id": "https://www.agpower.in/#service",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
        },
      },
    ]
    const res = verifyNoForbiddenEntities(invalidGraph)
    expect(res.valid).toBe(false)
    expect(res.issues.some((i) => i.message.includes("Brand"))).toBe(true)
    expect(res.issues.some((i) => i.message.includes("aggregateRating"))).toBe(true)
  })
})

describe("End-to-End Schema Graph Generation", () => {
  it("generates valid Homepage graph with 4 nodes (WebSite, Organization+ProfessionalService, founder Person, WebPage with nested FAQ + BreadcrumbList)", async () => {
    const resolved = resolveHomepageData(null)
    const graph = await generateSchemaGraph(resolved)

    expect(graph["@context"]).toBe("https://schema.org")
    expect(graph["@graph"].length).toBe(4)

    const rawTypes = graph["@graph"].map((n) => n["@type"])
    // Organization is a plain Organization (no OnlineStore)
    const hasOrg = rawTypes.some((t) => (Array.isArray(t) ? t.includes("Organization") : t === "Organization"))
    const hasSite = rawTypes.includes("WebSite")
    const hasPage = rawTypes.includes("WebPage")
    const homePageNode = graph["@graph"].find((n) => n["@type"] === "WebPage")
    const hasBreadcrumb = homePageNode?.breadcrumb?.["@type"] === "BreadcrumbList"

    expect(hasOrg).toBe(true)
    expect(hasSite).toBe(true)
    expect(hasPage).toBe(true)
    expect(hasBreadcrumb).toBe(true)

    // Founder Person is a top-level node with a stable @id; no standalone ImageObject, FAQPage, bare LocalBusiness
    expect(rawTypes).toContain("Person")
    expect(rawTypes).not.toContain("ImageObject")
    expect(rawTypes).not.toContain("FAQPage")
    expect(rawTypes).not.toContain("LocalBusiness")
    const person = graph["@graph"].find((n) => n["@type"] === "Person")
    expect(person?.["@id"]).toBe("https://www.agpower.in/#founder")
    expect(person?.jobTitle).toBe(DEFAULT_ORGANIZATION_PROFILE.founder.jobTitle)
    expect(person?.worksFor).toEqual({ "@id": "https://www.agpower.in/#organization" })

    // FAQ must be nested inside WebPage.hasPart
    const webPageNode = graph["@graph"].find((n) => n["@type"] === "WebPage")
    expect(webPageNode?.hasPart?.["@type"]).toBe("FAQPage")

    // Founder and logo must be nested inside Organization
    const orgNode = graph["@graph"].find((n) =>
      Array.isArray(n["@type"]) ? n["@type"].includes("Organization") : n["@type"] === "Organization"
    )
    expect(orgNode?.founder).toEqual({ "@id": "https://www.agpower.in/#founder" })
    expect(orgNode?.logo?.["@type"]).toBe("ImageObject")
    expect(orgNode?.["@type"]).toEqual(["Organization", "ProfessionalService"])
    // NAP matches the visible /contact page
    expect(orgNode?.telephone).toBe(DEFAULT_ORGANIZATION_PROFILE.telephone)
    expect(orgNode?.email).toBe(DEFAULT_ORGANIZATION_PROFILE.email)
    expect(orgNode?.address?.["@type"]).toBe("PostalAddress")
    expect(orgNode?.contactPoint.map((c: any) => c.telephone)).toEqual(["+919876543210"])
    expect(orgNode?.openingHoursSpecification?.[0]).toMatchObject({
      "@type": "OpeningHoursSpecification",
      opens: "09:00",
      closes: "19:00",
    })
    expect(orgNode?.areaServed).toEqual([
      { "@type": "Country", name: "India" },
    ])
    expect(orgNode?.hasMap).toBeUndefined()
    expect(orgNode?.geo).toBeUndefined()
    expect(orgNode?.priceRange).toBeUndefined()
    expect(orgNode?.hasMerchantReturnPolicy).toBeUndefined()
    expect(orgNode?.knowsAbout).toBeDefined()

    // Assert no forbidden entities
    const checkForbidden = verifyNoForbiddenEntities(graph["@graph"])
    expect(checkForbidden.valid).toBe(true)

    // Assert all references resolve
    const checkRefs = verifyGraphIdReferences(graph["@graph"])
    expect(checkRefs.valid).toBe(true)
  })

  it("generates a service graph: WebPage (nested FAQ + breadcrumb) and a Service node", async () => {
    const resolved = resolveServiceData({
      slug: "performance-marketing",
      title: "Performance Marketing",
      shortLabel: "Performance",
      description: "Scale your revenue through Meta and Google ads.",
      intro: "Intro text",
      image: "/images/performance.jpg",
      points: ["Full ad audit", "Creative iteration"],
      outcomes: ["Lower CAC", "Higher ROAS"],
      whyItMatters: [],
      faqs: [
        {
          question: "What platforms do you run ads on?",
          answer: "We run ads primarily on Meta Ads and Google Ads with data-backed tracking.",
        },
      ],
    })

    const graph = await generateSchemaGraph(resolved)
    expect(graph["@graph"].length).toBe(4)

    const types = graph["@graph"].map((n) => n["@type"])
    expect(types).toEqual(["WebPage", "Service", "Organization", "WebSite"])
    const serviceNode = graph["@graph"].find((n) => n["@type"] === "Service")
    expect(serviceNode?.provider?.["@id"]).toBe("https://www.agpower.in/#organization")

    // FAQ must be nested inside WebPage.hasPart
    const webPageNode = graph["@graph"].find((n) => n["@type"] === "WebPage")
    expect(webPageNode?.hasPart?.["@type"]).toBe("FAQPage")

    // Non-home pages carry only compact Organization / WebSite nodes
    const org = graph["@graph"].find((n) => n["@type"] === "Organization")
    expect(Object.keys(org || {}).sort()).toEqual(["@id", "@type", "logo", "name", "url"])
    const site = graph["@graph"].find((n) => n["@type"] === "WebSite")
    expect(site?.publisher).toEqual({ "@id": "https://www.agpower.in/#organization" })
    expect(serviceNode?.areaServed).toEqual([{ "@type": "Country", name: "India" }])
  })

  it("generates valid BlogPosting graph (BlogPosting, WebPage, founder Person, compact Organization + WebSite)", async () => {
    const resolved = resolveBlogData({
      id: "post-1",
      slug: "automation-tips",
      title: "10 Automation Tips for D2C Brands",
      category_id: "Business Automation",
      featured_image: "/blog/post1.webp",
      image_urls: [],
      excerpt: "Practical guide to business automation.",
      content: "Full content...",
      author_name: DEFAULT_ORGANIZATION_PROFILE.founder.name,
      status: "published",
      published_at: "2026-05-20T08:00:00Z",
      updated_at: "2026-05-21T09:00:00Z",
      meta_title: null,
      meta_description: null,
      faqs: [],
    })

    const graph = await generateSchemaGraph(resolved)
    expect(graph["@graph"].length).toBe(5)

    const types = graph["@graph"].map((n) => n["@type"])
    expect(types).toEqual(["BlogPosting", "Person", "WebPage", "Organization", "WebSite"])

    const articleNode = graph["@graph"].find((n) => n["@type"] === "BlogPosting")
    expect(articleNode?.headline).toBe("10 Automation Tips for D2C Brands")
    // Author is the founder, so the byline references the founder Person by @id
    expect(articleNode?.author).toEqual({
      "@id": "https://www.agpower.in/#founder",
    })
    expect(articleNode?.publisher).toEqual({
      "@id": "https://www.agpower.in/#organization",
    })
    expect(articleNode?.mainEntityOfPage).toEqual({
      "@id": "https://www.agpower.in/blog/automation-tips#webpage",
    })
  })

  it("generates valid Case Study graph (WebPage + Article about the client, compact Organization + WebSite)", async () => {
    const resolved = resolveCaseStudyData({
      slug: "the-kids-store",
      category: "Ecommerce · PPC",
      title: "The Kids Store",
      challenge: "High CAC",
      image: "/images/kids.webp",
      whatWeDid: ["Redesign", "Ads"],
      results: ["Conversion grew to 2.8%"],
      metrics: [],
    })

    const graph = await generateSchemaGraph(resolved)
    expect(graph["@graph"].length).toBe(4)

    const types = graph["@graph"].map((n) => n["@type"])
    expect(types).toEqual(["WebPage", "Article", "Organization", "WebSite"])

    const article = graph["@graph"].find((n) => n["@type"] === "Article")
    expect(article?.headline).toBe("The Kids Store")
    expect(article?.about).toEqual({ "@type": "Organization", name: "The Kids Store" })
    expect(article?.isPartOf).toEqual({ "@id": "https://www.agpower.in/work/the-kids-store#webpage" })
    expect(article?.author).toEqual({ "@id": "https://www.agpower.in/#organization" })
    expect(article?.image).toBe("https://www.agpower.in/images/kids.webp")

    // Breadcrumb must be Home > Case Studies > The Kids Store
    const csPage = graph["@graph"].find((n) => n["@type"] === "WebPage")
    const names = csPage?.breadcrumb?.itemListElement.map((item: any) => item.name)
    expect(names).toEqual(["Home", "Case Studies", "The Kids Store"])
  })

    // Phase 4: Removed store collection test case.

  it("generates AboutPage graph for /about (AboutPage, founder Person, compact Organization + WebSite)", async () => {
    const { resolveAboutData } = await import("../resolvers/page")
    const resolved = resolveAboutData(null)

    const graph = await generateSchemaGraph(resolved)
    expect(graph["@graph"].length).toBe(4)

    const types = graph["@graph"].map((n) => n["@type"])
    expect(types).toEqual(["AboutPage", "Person", "Organization", "WebSite"])

    const pageNode = graph["@graph"].find((n) => n["@type"] === "AboutPage")
    // mainEntity must be reference to #organization only
    expect(pageNode?.mainEntity).toEqual({
      "@id": "https://www.agpower.in/#organization",
    })
  })

  it("generates ContactPage graph for /contact (ContactPage, compact Organization + WebSite)", async () => {
    const { resolveContactData } = await import("../resolvers/page")
    const resolved = resolveContactData(null)

    const graph = await generateSchemaGraph(resolved)
    expect(graph["@graph"].length).toBe(3)

    const types = graph["@graph"].map((n) => n["@type"])
    expect(types).toEqual(["ContactPage", "Organization", "WebSite"])

    const pageNode = graph["@graph"].find((n) => n["@type"] === "ContactPage")
    // mainEntity must be reference to #organization only
    expect(pageNode?.mainEntity).toEqual({
      "@id": "https://www.agpower.in/#organization",
    })
  })

  // Phase 4: Removed store Product schema test case.

  it("detects forbidden entities when aggregateRating or review is present", () => {
    const forbiddenGraph = [
      {
        "@type": "Product",
        name: "Test Product",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 5,
        },
      },
    ]

    const result = verifyNoForbiddenEntities(forbiddenGraph)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.message.includes("aggregateRating"))).toBe(true)
  })

  it("derives correct storefront paths from seo_setting page_keys", async () => {
    const { derivePathFromPageKey } = await import("@lib/revalidate")
    expect(derivePathFromPageKey("home")).toBe("/")
    expect(derivePathFromPageKey("about")).toBe("/about")
    expect(derivePathFromPageKey("service:performance-marketing")).toBe("/services/performance-marketing")
    expect(derivePathFromPageKey("blog:how-to-scale")).toBe("/blog/how-to-scale")
    expect(derivePathFromPageKey("work:the-kids-store")).toBe("/work/the-kids-store")
    expect(derivePathFromPageKey("unknown-custom-key")).toBeNull()
  })

  it("enforces strict graph shape rules across all 17 public routes", async () => {
    const {
      resolveContactData,
      resolveCollectionData,
      resolveEditzData,
      resolveLegalPageData,
    } = await import("../resolvers")

    const dummyService = {
      slug: "performance-marketing",
      title: "Performance Marketing",
      shortLabel: "Performance",
      description: "Scale your revenue through Meta and Google ads.",
      intro: "Intro text",
      image: "/images/performance.jpg",
      points: ["Point 1"],
      outcomes: ["Outcome 1"],
      whyItMatters: [],
      faqs: [{ question: "Q1?", answer: "A1 answering in forty to sixty words for test." }]
    }

    const dummyBlog = {
      id: "b1",
      slug: "advantage-automation-business-growth",
      title: "Advantage of Automation in Business Growth",
      category_id: "Automation",
      featured_image: "/blog/post.webp",
      image_urls: [],
      excerpt: "Excerpt",
      content: "Content",
      author_name: "AG POWER Technical Desk",
      status: "published",
      published_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
      meta_title: null,
      meta_description: null,
      faqs: []
    }

    const dummyCaseStudy = {
      slug: "the-kids-store",
      category: "Ecommerce · PPC",
      title: "The Kids Store",
      challenge: "High CAC",
      image: "/images/kids.webp",
      whatWeDid: ["Redesign", "Ads"],
      results: ["Conversion grew to 2.8%"],
      metrics: [],
    }

    const routes = [
      { path: "/", resolved: resolveHomepageData() },
      { path: "/about", resolved: (await import("../resolvers/page")).resolveAboutData() },
      { path: "/contact", resolved: resolveContactData() },
      { path: "/services", resolved: resolveCollectionData({ section: "services", items: [] }) },
      { path: "/services/performance-marketing", resolved: resolveServiceData(dummyService) },
      { path: "/services/social-media-marketing", resolved: resolveServiceData({ ...dummyService, slug: "social-media-marketing" }) },
      { path: "/services/search-engine-optimization", resolved: resolveServiceData({ ...dummyService, slug: "search-engine-optimization" }) },
      { path: "/services/ai-agentic-service", resolved: resolveServiceData({ ...dummyService, slug: "ai-agentic-service" }) },
      { path: "/work", resolved: resolveCollectionData({ section: "work", items: [] }) },
      { path: "/work/the-kids-store", resolved: resolveCaseStudyData(dummyCaseStudy) },
      { path: "/blog", resolved: resolveCollectionData({ section: "blog", items: [] }) },
      { path: "/blog/advantage-automation-business-growth", resolved: resolveBlogData(dummyBlog) },
      { path: "/blog-ai", resolved: resolveLegalPageData("blog-ai", "Blog AI", "Blog AI desc") },
      { path: "/editz", resolved: resolveEditzData() },
      { path: "/terms-and-conditions", resolved: resolveLegalPageData("terms-and-conditions", "Terms", "Terms desc") },
      { path: "/privacy-policy", resolved: resolveLegalPageData("privacy-policy", "Privacy", "Privacy desc") },
    ]

    for (const r of routes) {
      const graph = await generateSchemaGraph(r.resolved)
      const types = graph["@graph"].map((n) => n["@type"])
      const refCheck = verifyGraphIdReferences(graph["@graph"])

      // Zero unresolved refs
      expect(refCheck.issues.filter((i) => i.severity === "error").length).toBe(0)

      // No forbidden entities
      const forbiddenCheck = verifyNoForbiddenEntities(graph["@graph"])
      expect(forbiddenCheck.valid).toBe(true)

      // Assert no @type appears more than once on any route
      const flatTypes = types.flat()
      const typeCounts: Record<string, number> = {}
      for (const t of flatTypes) {
        typeCounts[t] = (typeCounts[t] || 0) + 1
      }
      for (const [t, count] of Object.entries(typeCounts)) {
        expect(count, `Type "${t}" appeared ${count} times on route ${r.path}`).toBe(1)
      }

      // ProfessionalService only on the full home Organization; never bare LocalBusiness
      if (r.path !== "/") expect(flatTypes).not.toContain("ProfessionalService")
      expect(flatTypes).not.toContain("LocalBusiness")
      expect(flatTypes).not.toContain("ElectronicsStore")

      // Exact allowed nodes per route (non-home pages end with compact Organization + WebSite)
      const site = ["Organization", "WebSite"]
      if (r.path === "/") {
        expect(types).toEqual(["WebSite", ["Organization", "ProfessionalService"], "Person", "WebPage"])
      } else if (r.path === "/about") {
        expect(types).toEqual(["AboutPage", "Person", ...site])
      } else if (r.path === "/contact") {
        expect(types).toEqual(["ContactPage", ...site])
      } else if (r.path === "/blog" || r.path === "/services" || r.path === "/work") {
        // Collections with no items yet: no ItemList (it appears once items exist)
        expect(types).toEqual(["CollectionPage", ...site])
      } else if (r.path.startsWith("/services/") || r.path === "/editz" || r.path === "/blog-ai") {
        expect(types).toEqual(["WebPage", "Service", ...site])
      } else if (r.path.startsWith("/blog/")) {
        expect(types).toContain("BlogPosting")
        expect(types).toContain("WebPage")
      } else if (r.path.startsWith("/work/")) {
        expect(types).toEqual(["WebPage", "Article", ...site])
      } else {
        // Legal pages
        expect(types).toEqual(["WebPage", ...site])
      }

      // Every page has exactly one Organization and one WebSite node
      expect(flatTypes.filter((t) => t === "Organization").length).toBe(1)
      expect(flatTypes.filter((t) => t === "WebSite").length).toBe(1)
      expect(flatTypes).not.toContain("OnlineStore")
    }
  })
})



