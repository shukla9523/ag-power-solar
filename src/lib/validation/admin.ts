/**
 * Purpose: Zod schemas for every admin content write (review item C4): blog posts,
 * services, case studies and blog-image uploads. Routes parse the body with these before
 * any database write, so malformed FAQ or array data can never reach the JSON-LD graph.
 * Shapes match what the admin editors send (BlogEditor, ServiceEditor, CaseStudyEditor,
 * the blog list PATCH toggles and MediaPicker).
 */

import { z } from "zod"

export const POST_STATUSES = ["draft", "scheduled", "published"] as const

export const MAX_FAQS = 30
export const MAX_CONTENT_CHARS = 500_000

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

/** A full http(s) URL or a site path such as /images/hero.webp. */
export function isImageRef(value: string): boolean {
  return isHttpUrl(value) || /^\/(?!\/)\S*$/.test(value)
}

const text = (max: number) => z.string().trim().max(max, `Must be at most ${max} characters`)

const requiredText = (max: number, label: string) =>
  z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`).max(max, `Must be at most ${max} characters`)

/** Image field that may be left empty ("" keeps the current fallback image). */
const optionalImage = text(1000).refine((v) => v === "" || isImageRef(v), "Use a full https:// URL or a path starting with /")

const imageList = z
  .array(text(1000).refine(isImageRef, "Use a full https:// URL or a path starting with /"))
  .max(20, "At most 20 images")

/** Free-text bullet list; blank lines are dropped instead of rejected. */
const stringList = (maxItems: number, maxChars = 1000) =>
  z
    .array(text(maxChars))
    .max(maxItems, `At most ${maxItems} items`)
    .transform((items) => items.filter((item) => item.length > 0))

export const FaqSchema = z.object({
  question: requiredText(300, "FAQ question"),
  answer: requiredText(3000, "FAQ answer"),
})

export const FaqListSchema = z.array(FaqSchema).max(MAX_FAQS, `At most ${MAX_FAQS} FAQs`)

const isoDate = z
  .string()
  .trim()
  .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Use an ISO date and time")
  .transform((v) => (v === "" ? null : v))

const BlogFields = {
  title: requiredText(200, "Title"),
  slug: text(120),
  status: z.enum(POST_STATUSES, { error: "Invalid status" }),
  publish_at: isoDate.nullable(),
  category_id: text(100).nullable(),
  featured_image: optionalImage.nullable(),
  image_urls: imageList,
  excerpt: text(2000),
  content: z.string().max(MAX_CONTENT_CHARS, "The article is too long"),
  author_name: text(100),
  meta_title: text(200),
  meta_description: text(2000),
  faqs: FaqListSchema,
}

/** POST /api/admin/blog — title required, everything else optional. */
export const BlogCreateSchema = z.object(BlogFields).partial().required({ title: true })

/** PUT/PATCH /api/admin/blog/[slug] — partial; `updated_at` enables the stale-write check. */
export const BlogUpdateSchema = z.object({ ...BlogFields, updated_at: z.string().max(64) }).partial()

const ServiceFields = {
  title: requiredText(200, "Title"),
  slug: text(120),
  short_label: text(200),
  description: text(2000),
  intro: text(5000),
  image: optionalImage,
  points: stringList(30),
  outcomes: stringList(30),
  why_it_matters: stringList(30),
  faqs: FaqListSchema,
}

export const ServiceCreateSchema = z.object(ServiceFields).partial().required({ title: true })
export const ServiceUpdateSchema = z.object(ServiceFields).partial()

const MetricSchema = z.object({
  label: requiredText(120, "Metric label"),
  before: text(120).default(""),
  after: text(120).default(""),
})

const CaseStudyFields = {
  title: requiredText(200, "Title"),
  slug: text(120),
  category: text(100),
  tagline: text(300),
  about: text(10_000),
  challenge: text(10_000),
  overview: text(10_000),
  solution: text(10_000),
  insights: text(10_000),
  image: optionalImage,
  accent: z.string().trim().regex(HEX_COLOR, "Accent must be a hex colour such as #e61e73"),
  what_we_did: stringList(30),
  results: stringList(30),
  metrics: z.array(MetricSchema).max(20, "At most 20 metrics"),
  faqs: FaqListSchema,
}

export const CaseStudyCreateSchema = z.object(CaseStudyFields).partial().required({ title: true })
export const CaseStudyUpdateSchema = z.object(CaseStudyFields).partial()

/** POST /api/admin/blog/images — base64 image body from MediaPicker / BlogEditor. */
export const BlogImageUploadSchema = z.object({
  name: requiredText(200, "Image name"),
  data: z
    .string({ error: "Image file is required" })
    .min(1, "Image file is required")
    .regex(/^[A-Za-z0-9+/=\r\n]+$/, "Image data must be base64"),
  type: z.string().max(100).optional(),
})
