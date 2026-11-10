/**
 * Purpose: the contract for editable product pages (EDITZ and Blog AI).
 *
 * Defines one Zod schema per editable section, the Blog AI code defaults, and the pure
 * merge used on read: product_pages.content holds ONLY overrides keyed by section; each
 * override is validated and an invalid or missing one falls back to the code default, so
 * an empty table (or no table at all) renders the pages exactly as the code ships them.
 * Shared by the server data layer, the admin API and the admin editor (client-side checks).
 */

import { z } from "zod"
import { EDITZ_DEFAULTS } from "@modules/editz/lib/content-defaults"

// ── Field helpers ──────────────────────────────────────────────────────────────

const required = (max: number) => z.string().trim().min(1, "Required").max(max, `Max ${max} characters`)
const optionalText = (max: number) => z.string().trim().max(max, `Max ${max} characters`)

const LINK_RE = /^(\/|#|https?:\/\/|mailto:|tel:)/i
const MEDIA_RE = /^(\/|https:\/\/)/i

/** A link: site path, anchor, http(s), mailto: or tel:. */
const link = required(500).refine((v) => LINK_RE.test(v) && !/\s/.test(v), "Must start with /, #, https://, mailto: or tel:")
/** An image or video source: a site path or an https URL. */
const media = required(500).refine((v) => MEDIA_RE.test(v) && !/\s/.test(v), "Must be a /path or an https:// URL")
const optionalMedia = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || (MEDIA_RE.test(v) && !/\s/.test(v)), "Must be empty, a /path or an https:// URL")

// ── EDITZ sections ─────────────────────────────────────────────────────────────

export const editzHeroSchema = z.object({
  badge: required(80),
  headlineAccent: required(60),
  headline: required(160),
  subtitle: required(400),
  ctaLabel: required(60),
  ctaHref: link,
  videos: z.array(z.object({ videoUrl: media, image: media })).min(1, "Add at least one video").max(3, "Max 3 videos"),
})

export const editzMarqueeSchema = z.object({
  items: z.array(required(60)).min(1, "Add at least one item").max(20, "Max 20 items"),
})

export const editzServicesSchema = z.object({
  badge: required(40),
  heading: required(120),
  items: z.array(z.object({ title: required(80), description: required(400) })).min(1, "Add at least one service").max(8, "Max 8 services"),
})

export const editzBrandsSchema = z.object({
  heading: required(80),
  logos: z.array(z.object({ name: required(80), src: media })).min(1, "Add at least one logo").max(20, "Max 20 logos"),
})

export const editzBenefitsSchema = z.object({
  badge: required(40),
  heading: required(120),
  chartTitle: required(120),
  chartChip1: required(60),
  chartChip2: required(60),
  chartHighlight: required(20),
  turnaroundTitle: required(60),
  turnaroundDescription: required(200),
  videoUrl: media,
  videoTitle: required(80),
  platformTitle: required(120),
  platformDescription: required(200),
  trustedTitle: required(80),
  revisionsTitle: required(60),
  revisionsDescription: required(200),
})

export const editzProjectsSchema = z.object({
  badge: required(40),
  heading: required(120),
  items: z
    .array(
      z.object({
        title: required(120),
        handle: required(60),
        views: required(40),
        metric: required(120),
        videoUrl: optionalMedia,
        thumbnail: media,
      })
    )
    .min(1, "Add at least one project")
    .max(6, "Max 6 projects"),
})

export const editzAudienceSchema = z.object({
  badge: required(40),
  heading: required(160),
  items: z.array(z.object({ title: required(60), description: required(300), image: media })).min(1, "Add at least one card").max(8, "Max 8 cards"),
})

export const editzProcessSchema = z.object({
  badge: required(40),
  heading: required(120),
  steps: z.array(z.object({ number: required(6), title: required(80), description: required(400) })).min(1, "Add at least one step").max(6, "Max 6 steps"),
})

export const editzTestimonialsSchema = z.object({
  badge: required(40),
  heading: required(160),
  items: z
    .array(
      z.object({
        quote: required(1000),
        author: required(80),
        role: required(120),
        company: required(80),
        metric: required(40),
        avatar: media,
      })
    )
    .min(1, "Add at least one testimonial")
    .max(9, "Max 9 testimonials"),
})

export const editzCtaSchema = z.object({
  headingAccent: required(60),
  heading: required(120),
  description: required(400),
  buttonLabel: required(60),
  buttonHref: link,
  instagramUrl: link,
  youtubeUrl: link,
  tiktokUrl: link,
})

export const EDITZ_SECTIONS = {
  hero: editzHeroSchema,
  marquee: editzMarqueeSchema,
  services: editzServicesSchema,
  brands: editzBrandsSchema,
  benefits: editzBenefitsSchema,
  projects: editzProjectsSchema,
  audience: editzAudienceSchema,
  process: editzProcessSchema,
  testimonials: editzTestimonialsSchema,
  cta: editzCtaSchema,
} as const

// ── Blog AI sections ───────────────────────────────────────────────────────────

export const blogAiHeroSchema = z.object({
  badge: required(80),
  titlePrefix: required(60),
  titleAccent: required(40),
  description: required(500),
  ctaLabel: required(60),
  ctaHref: link,
})

export const blogAiLeadFormSchema = z.object({
  enabled: z.boolean(),
  heading: optionalText(120),
  description: optionalText(400),
})

export const BLOG_AI_SECTIONS = {
  hero: blogAiHeroSchema,
  leadForm: blogAiLeadFormSchema,
} as const

// ── Types ──────────────────────────────────────────────────────────────────────

type ContentOf<T extends Record<string, z.ZodType>> = { [K in keyof T]: z.infer<T[K]> }

export type EditzContent = ContentOf<typeof EDITZ_SECTIONS>
export type BlogAiContent = ContentOf<typeof BLOG_AI_SECTIONS>
export type EditzHeroContent = EditzContent["hero"]
export type EditzServicesContent = EditzContent["services"]
export type EditzBrandsContent = EditzContent["brands"]
export type EditzBenefitsContent = EditzContent["benefits"]
export type EditzProjectsContent = EditzContent["projects"]
export type EditzProjectItem = EditzProjectsContent["items"][number]
export type EditzAudienceContent = EditzContent["audience"]
export type EditzProcessContent = EditzContent["process"]
export type EditzTestimonialsContent = EditzContent["testimonials"]
export type EditzCtaContent = EditzContent["cta"]

export type ProductContentMap = { editz: EditzContent; "blog-ai": BlogAiContent }
export type ProductSlug = keyof ProductContentMap

export const PRODUCT_SECTIONS: { [S in ProductSlug]: Record<string, z.ZodType> } = {
  editz: EDITZ_SECTIONS,
  "blog-ai": BLOG_AI_SECTIONS,
}

export const PRODUCT_PATHS: Record<ProductSlug, string> = { editz: "/editz", "blog-ai": "/blog-ai" }

// ── Blog AI defaults (today's hardcoded page) ──────────────────────────────────

export const BLOG_AI_DEFAULTS: BlogAiContent = {
  hero: {
    badge: "\u{1F916} AI Content Systems",
    titlePrefix: "Blog",
    titleAccent: "AI",
    description:
      "We are building an intelligent content engine to automate blog creation, SEO optimization, and agentic publishing. Stay tuned!",
    ctaLabel: "Back to Home",
    ctaHref: "/",
  },
  leadForm: {
    enabled: false,
    heading: "Get early access to Blog AI",
    description: "Tell us about your content goals and we will reach out when Blog AI is ready for you.",
  },
}

export const PRODUCT_DEFAULTS: ProductContentMap = { editz: EDITZ_DEFAULTS, "blog-ai": BLOG_AI_DEFAULTS }

// ── Helpers ────────────────────────────────────────────────────────────────────

export function isProductSlug(value: unknown): value is ProductSlug {
  return value === "editz" || value === "blog-ai"
}

export function isSectionKey(slug: ProductSlug, key: unknown): key is string {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(PRODUCT_SECTIONS[slug], key)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Turns the stored jsonb into a plain override object (anything else becomes {}). */
export function toOverrideObject(value: unknown): Record<string, unknown> {
  return isPlainObject(value) ? value : {}
}

export type SectionValidation = { ok: true; value: unknown } | { ok: false; error: string }

/** Validates one section value for saving. Returns the parsed (trimmed) value or a readable error. */
export function validateSection(slug: ProductSlug, section: string, value: unknown): SectionValidation {
  if (!isSectionKey(slug, section)) return { ok: false, error: "Unknown section" }
  const result = PRODUCT_SECTIONS[slug][section].safeParse(value)
  if (result.success) return { ok: true, value: result.data }
  const messages = result.error.issues.slice(0, 3).map((issue) => {
    const path = issue.path.map((p) => (typeof p === "number" ? `#${p + 1}` : String(p))).join(" › ")
    return path ? `${path}: ${issue.message}` : issue.message
  })
  return { ok: false, error: messages.join("; ") }
}

/**
 * Merges stored overrides onto the code defaults. Unknown keys are ignored and an override
 * that fails its schema is dropped (that section falls back to its default).
 */
export function mergeProductContent<S extends ProductSlug>(
  slug: S,
  overrides: unknown
): { content: ProductContentMap[S]; overridden: string[] } {
  const stored = toOverrideObject(overrides)
  const defaults = PRODUCT_DEFAULTS[slug] as unknown as Record<string, unknown>
  const merged: Record<string, unknown> = {}
  const overridden: string[] = []

  for (const [key, schema] of Object.entries(PRODUCT_SECTIONS[slug])) {
    merged[key] = defaults[key]
    if (stored[key] === undefined) continue
    const parsed = schema.safeParse(stored[key])
    if (parsed.success) {
      merged[key] = parsed.data
      overridden.push(key)
    }
  }
  return { content: merged as ProductContentMap[S], overridden }
}
