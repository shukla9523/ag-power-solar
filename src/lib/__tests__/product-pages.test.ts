/**
 * Tests for editable product pages (Phase 7): the section Zod schemas, the code defaults
 * (which must reproduce today's hardcoded pages) and the default/override merge, including
 * dropping invalid or unknown overrides.
 */
import { describe, it, expect } from "vitest"
import {
  BLOG_AI_DEFAULTS,
  EDITZ_SECTIONS,
  BLOG_AI_SECTIONS,
  isProductSlug,
  isSectionKey,
  mergeProductContent,
  toOverrideObject,
  validateSection,
} from "../validation/product-pages"
import { EDITZ_DEFAULTS } from "@modules/editz/lib/content-defaults"

describe("Product page defaults", () => {
  it("every EDITZ default section passes its own schema", () => {
    for (const [key, schema] of Object.entries(EDITZ_SECTIONS)) {
      const result = schema.safeParse((EDITZ_DEFAULTS as Record<string, unknown>)[key])
      expect(result.success, `editz.${key}`).toBe(true)
    }
  })

  it("every Blog AI default section passes its own schema", () => {
    for (const [key, schema] of Object.entries(BLOG_AI_SECTIONS)) {
      const result = schema.safeParse((BLOG_AI_DEFAULTS as Record<string, unknown>)[key])
      expect(result.success, `blog-ai.${key}`).toBe(true)
    }
  })

  it("keeps the Blog AI lead form off by default", () => {
    expect(BLOG_AI_DEFAULTS.leadForm.enabled).toBe(false)
  })

  it("keeps today's EDITZ hero copy and section counts", () => {
    expect(EDITZ_DEFAULTS.hero.headlineAccent).toBe("Video Editing")
    expect(EDITZ_DEFAULTS.hero.videos).toHaveLength(3)
    expect(EDITZ_DEFAULTS.services.items).toHaveLength(4)
    expect(EDITZ_DEFAULTS.projects.items).toHaveLength(6)
    expect(EDITZ_DEFAULTS.process.steps).toHaveLength(3)
    expect(EDITZ_DEFAULTS.testimonials.items).toHaveLength(3)
  })
})

describe("mergeProductContent", () => {
  it("returns the defaults when there are no overrides", () => {
    const { content, overridden } = mergeProductContent("editz", {})
    expect(content).toEqual(EDITZ_DEFAULTS)
    expect(overridden).toEqual([])
  })

  it("treats null, arrays and strings as no overrides", () => {
    for (const bad of [null, undefined, [], "x", 3]) {
      expect(mergeProductContent("blog-ai", bad).content).toEqual(BLOG_AI_DEFAULTS)
    }
  })

  it("applies a valid section override and leaves other sections on their default", () => {
    const testimonials = {
      badge: "Reviews",
      heading: "Loved by\ncreators",
      items: [{ quote: "Great", author: "A", role: "B", company: "C", metric: "+1", avatar: "/a.jpg" }],
    }
    const { content, overridden } = mergeProductContent("editz", { testimonials })
    expect(content.testimonials).toEqual(testimonials)
    expect(content.services).toEqual(EDITZ_DEFAULTS.services)
    expect(overridden).toEqual(["testimonials"])
  })

  it("drops an invalid override and falls back to the default for that section only", () => {
    const { content, overridden } = mergeProductContent("editz", {
      services: { badge: "Services", heading: "", items: [] },
      cta: { ...EDITZ_DEFAULTS.cta, heading: "Begins Now" },
    })
    expect(content.services).toEqual(EDITZ_DEFAULTS.services)
    expect(content.cta.heading).toBe("Begins Now")
    expect(overridden).toEqual(["cta"])
  })

  it("ignores unknown section keys", () => {
    const { content, overridden } = mergeProductContent("blog-ai", { evil: { x: 1 } })
    expect(content).toEqual(BLOG_AI_DEFAULTS)
    expect(Object.keys(content)).not.toContain("evil")
    expect(overridden).toEqual([])
  })

  it("trims override strings through the schema", () => {
    const { content } = mergeProductContent("blog-ai", { leadForm: { enabled: true, heading: "  Join  ", description: "" } })
    expect(content.leadForm).toEqual({ enabled: true, heading: "Join", description: "" })
  })
})

describe("validateSection", () => {
  it("accepts a valid section and returns the parsed value", () => {
    const result = validateSection("blog-ai", "hero", { ...BLOG_AI_DEFAULTS.hero, titleAccent: "  AI  " })
    expect(result.ok).toBe(true)
    if (result.ok) expect((result.value as { titleAccent: string }).titleAccent).toBe("AI")
  })

  it("rejects unknown sections", () => {
    expect(validateSection("editz", "nope", {})).toEqual({ ok: false, error: "Unknown section" })
  })

  it("rejects empty required fields with a readable path", () => {
    const result = validateSection("editz", "process", {
      ...EDITZ_DEFAULTS.process,
      steps: [{ number: "01", title: "", description: "x" }],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain("steps › #1 › title")
  })

  it("rejects unsafe links and media URLs", () => {
    expect(validateSection("blog-ai", "hero", { ...BLOG_AI_DEFAULTS.hero, ctaHref: "javascript:alert(1)" }).ok).toBe(false)
    expect(
      validateSection("editz", "brands", { heading: "Brands", logos: [{ name: "X", src: "http://insecure.example/logo.png" }] }).ok
    ).toBe(false)
    expect(validateSection("editz", "brands", { heading: "Brands", logos: [{ name: "X", src: "/logo.webp" }] }).ok).toBe(true)
  })

  it("enforces list limits (max 3 hero videos, max 6 projects)", () => {
    const video = { videoUrl: "/v.mp4", image: "/p.jpg" }
    expect(validateSection("editz", "hero", { ...EDITZ_DEFAULTS.hero, videos: [video, video, video, video] }).ok).toBe(false)
    const project = EDITZ_DEFAULTS.projects.items[0]
    expect(validateSection("editz", "projects", { ...EDITZ_DEFAULTS.projects, items: Array(7).fill(project) }).ok).toBe(false)
  })

  it("allows an empty optional project video", () => {
    const items = [{ ...EDITZ_DEFAULTS.projects.items[0], videoUrl: "" }]
    expect(validateSection("editz", "projects", { ...EDITZ_DEFAULTS.projects, items }).ok).toBe(true)
  })
})

describe("helpers", () => {
  it("recognises product slugs and section keys", () => {
    expect(isProductSlug("editz")).toBe(true)
    expect(isProductSlug("blog-ai")).toBe(true)
    expect(isProductSlug("other")).toBe(false)
    expect(isSectionKey("editz", "hero")).toBe(true)
    expect(isSectionKey("editz", "leadForm")).toBe(false)
    expect(isSectionKey("blog-ai", "toString")).toBe(false)
  })

  it("toOverrideObject only accepts plain objects", () => {
    expect(toOverrideObject({ a: 1 })).toEqual({ a: 1 })
    expect(toOverrideObject([1])).toEqual({})
    expect(toOverrideObject(null)).toEqual({})
  })
})
