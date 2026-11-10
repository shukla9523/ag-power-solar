/**
 * Tests for the admin write schemas (review item C4). The "editor payload" cases mirror
 * exactly what BlogEditor, ServiceEditor, CaseStudyEditor, the blog list PATCH toggles and
 * MediaPicker send, so a schema change that would break the admin UI fails here.
 */
import { describe, it, expect } from "vitest"
import {
  BlogCreateSchema,
  BlogImageUploadSchema,
  BlogUpdateSchema,
  CaseStudyCreateSchema,
  CaseStudyUpdateSchema,
  MAX_FAQS,
  ServiceCreateSchema,
  ServiceUpdateSchema,
  isImageRef,
} from "../validation/admin"

const faqs = [{ question: "What is D2C?", answer: "Direct to consumer." }]

const blogEditorPayload = {
  title: "Scaling D2C brands",
  slug: "scaling-d2c-brands",
  category_id: "",
  featured_image: "",
  excerpt: "Short summary",
  content: "<p>Body</p>",
  author_name: "Mommantum Team",
  status: "draft",
  publish_at: null,
  meta_title: "Scaling D2C brands",
  meta_description: "Short summary",
  image_urls: ["https://example.supabase.co/storage/v1/object/public/blog-images/a.webp", "/images/b.webp"],
  faqs,
}

describe("blog schemas", () => {
  it("accepts the BlogEditor create payload", () => {
    expect(BlogCreateSchema.safeParse(blogEditorPayload).success).toBe(true)
  })

  it("accepts a scheduled post with an ISO time", () => {
    const r = BlogCreateSchema.safeParse({ ...blogEditorPayload, status: "scheduled", publish_at: new Date().toISOString() })
    expect(r.success).toBe(true)
  })

  it("accepts the blog list PATCH toggle { status }", () => {
    expect(BlogUpdateSchema.safeParse({ status: "published" }).success).toBe(true)
    expect(BlogUpdateSchema.safeParse({ status: "draft" }).success).toBe(true)
  })

  it("does not inject defaults into a partial update", () => {
    const r = BlogUpdateSchema.safeParse({ status: "draft" })
    expect(r.success && Object.keys(r.data)).toEqual(["status"])
  })

  it("rejects a missing title, an unknown status and a bad image", () => {
    expect(BlogCreateSchema.safeParse({ ...blogEditorPayload, title: "  " }).success).toBe(false)
    expect(BlogCreateSchema.safeParse({ slug: "x" }).success).toBe(false)
    expect(BlogUpdateSchema.safeParse({ status: "archived" }).success).toBe(false)
    expect(BlogUpdateSchema.safeParse({ featured_image: "javascript:alert(1)" }).success).toBe(false)
    expect(BlogUpdateSchema.safeParse({ image_urls: ["//evil.example/x.png"] }).success).toBe(false)
  })

  it("rejects blank FAQ answers and too many FAQs", () => {
    expect(BlogUpdateSchema.safeParse({ faqs: [{ question: "Q?", answer: "   " }] }).success).toBe(false)
    const many = Array.from({ length: MAX_FAQS + 1 }, () => faqs[0])
    expect(BlogUpdateSchema.safeParse({ faqs: many }).success).toBe(false)
  })

  it("trims FAQ text and strips unknown keys", () => {
    const r = BlogUpdateSchema.safeParse({ faqs: [{ question: " Q? ", answer: " A. ", extra: "x" }], hacker: true })
    expect(r.success && r.data).toEqual({ faqs: [{ question: "Q?", answer: "A." }] })
  })

  it("treats an empty publish_at as null", () => {
    const r = BlogUpdateSchema.safeParse({ publish_at: "" })
    expect(r.success && r.data.publish_at).toBeNull()
  })
})

describe("service schemas", () => {
  const servicePayload = {
    title: "SEO",
    slug: "seo",
    short_label: "SEO",
    description: "Search engine optimisation",
    intro: "Intro",
    image: "/images/seo.webp",
    points: ["One", "Two"],
    outcomes: ["More traffic"],
    why_it_matters: ["Because"],
    faqs,
  }

  it("accepts the ServiceEditor payload for create and update", () => {
    expect(ServiceCreateSchema.safeParse(servicePayload).success).toBe(true)
    expect(ServiceUpdateSchema.safeParse(servicePayload).success).toBe(true)
    expect(ServiceCreateSchema.safeParse({ ...servicePayload, image: "" }).success).toBe(true)
  })

  it("drops blank list items instead of rejecting them", () => {
    const r = ServiceUpdateSchema.safeParse({ points: ["One", "  ", ""] })
    expect(r.success && r.data.points).toEqual(["One"])
  })

  it("rejects non-string list items", () => {
    expect(ServiceUpdateSchema.safeParse({ points: [{ a: 1 }] }).success).toBe(false)
  })
})

describe("case study schemas", () => {
  const casePayload = {
    title: "Brand X",
    slug: "brand-x",
    category: "D2C",
    tagline: "Tagline",
    about: "About",
    challenge: "Challenge",
    overview: "Overview",
    solution: "Solution",
    insights: "Insights",
    image: "https://cdn.example.com/x.webp",
    accent: "#e61e73",
    what_we_did: ["Ads"],
    results: ["3x ROAS"],
    metrics: [{ label: "ROAS", before: "1x", after: "3x" }],
    faqs: [],
  }

  it("accepts the CaseStudyEditor payload", () => {
    expect(CaseStudyCreateSchema.safeParse(casePayload).success).toBe(true)
    expect(CaseStudyUpdateSchema.safeParse(casePayload).success).toBe(true)
  })

  it("accepts a metric with an empty 'before' value", () => {
    expect(CaseStudyUpdateSchema.safeParse({ metrics: [{ label: "CAC", before: "", after: "-40%" }] }).success).toBe(true)
  })

  it("rejects a non-hex accent and a metric without a label", () => {
    expect(CaseStudyUpdateSchema.safeParse({ accent: "red" }).success).toBe(false)
    expect(CaseStudyUpdateSchema.safeParse({ accent: "#e61e73;background:url(x)" }).success).toBe(false)
    expect(CaseStudyUpdateSchema.safeParse({ metrics: [{ label: "", after: "3x" }] }).success).toBe(false)
  })
})

describe("blog image upload schema", () => {
  it("accepts the MediaPicker and BlogEditor bodies", () => {
    expect(BlogImageUploadSchema.safeParse({ name: "a.png", data: "iVBORw0KGgo=" }).success).toBe(true)
    expect(BlogImageUploadSchema.safeParse({ name: "a.png", type: "image/png", data: "iVBORw0KGgo=" }).success).toBe(true)
  })

  it("rejects a missing file or non-base64 data", () => {
    expect(BlogImageUploadSchema.safeParse({ name: "a.png" }).success).toBe(false)
    expect(BlogImageUploadSchema.safeParse({ name: "a.png", data: "<svg>" }).success).toBe(false)
  })
})

describe("isImageRef", () => {
  it("allows https URLs and site paths only", () => {
    expect(isImageRef("https://www.mommantum.com/a.webp")).toBe(true)
    expect(isImageRef("/images/a.webp")).toBe(true)
    expect(isImageRef("//evil.example/a.webp")).toBe(false)
    expect(isImageRef("data:image/png;base64,AAA")).toBe(false)
    expect(isImageRef("javascript:alert(1)")).toBe(false)
  })
})
