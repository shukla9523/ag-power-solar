/**
 * Purpose: on-demand SEO / AEO / GEO audit of every page in the page registry.
 *
 * Per page: completeness of the meta object (title, description, 5 keywords, OG/Twitter,
 * image + alt/title, FAQs), length checks, noindex flags, and image presence. Site-wide:
 * duplicate titles/descriptions, keyword cannibalization, sitemap coverage. Each issue is
 * phrased as "what is wrong + what to do".
 */

import "server-only"
import { getPageRegistry } from "@lib/seo/page-registry"
import { listSeoRows } from "@lib/seo/seo-store"
import { getKeywordMap } from "@lib/seo/keyword-links"
import { SEO_LIMITS, isEmptyValue } from "@lib/seo/meta-fields"
import { getEditzFaqs, getPageFaqs } from "@lib/data/page-faqs"
import { PAGE_META_DEFAULTS } from "@lib/schema/page-defaults"

export type Severity = "error" | "warning" | "info"

export interface PageReport {
  pageKey: string
  path: string
  title: string
  kind: string
  score: number
  indexable: boolean
  issues: { severity: Severity; message: string }[]
  fields: Record<string, boolean>
}

export interface SeoReport {
  generatedAt: string
  averageScore: number
  pages: PageReport[]
  siteIssues: { severity: Severity; message: string }[]
  totals: { pages: number; errors: number; warnings: number; missingImages: number; missingKeywords: number }
}

const CHECKED_FIELDS = [
  "meta_title",
  "meta_description",
  "primary_keyword",
  "secondary_keywords",
  "og_title",
  "og_description",
  "og_image",
  "twitter_title",
  "image_alt",
  "image_title",
] as const

export async function buildSeoReport(): Promise<SeoReport> {
  const [pages, rows, keywordMap] = await Promise.all([getPageRegistry(), listSeoRows().catch(() => []), getKeywordMap()])
  const rowByKey = new Map(rows.map((r) => [String(r.page_key), r]))

  const titleCount = new Map<string, string[]>()
  const descCount = new Map<string, string[]>()
  const reports: PageReport[] = []

  for (const page of pages) {
    const row =
      (rowByKey.get(page.pageKey) as Record<string, unknown> | undefined) ||
      (page.legacyKeys || []).map((k) => rowByKey.get(k)).find(Boolean) ||
      null
    const issues: PageReport["issues"] = []
    const fields: Record<string, boolean> = {}

    for (const f of CHECKED_FIELDS) fields[f] = Boolean(row && !isEmptyValue(row[f]))
    const hasImage = Boolean(page.image) || fields.og_image
    fields.image = hasImage

    const title = String(row?.meta_title || PAGE_META_DEFAULTS[page.pageKey]?.title || page.title || "")
    const description = String(row?.meta_description || PAGE_META_DEFAULTS[page.pageKey]?.description || page.description || "")
    const secondary = Array.isArray(row?.secondary_keywords) ? (row!.secondary_keywords as string[]) : []
    const faqs = page.pageKey === "editz" ? getEditzFaqs(row) : getPageFaqs(page.pageKey, row)
    fields.faqs = faqs.length > 0
    const indexable = row?.robots_index !== false

    if (!fields.meta_title) issues.push({ severity: "warning", message: "Meta title uses the template fallback — add a keyword-led title (50–60 characters)." })
    else if (title.length > SEO_LIMITS.metaTitle.max) issues.push({ severity: "warning", message: `Meta title is ${title.length} characters — shorten to ${SEO_LIMITS.metaTitle.max} or fewer.` })
    else if (title.length < SEO_LIMITS.metaTitle.min) issues.push({ severity: "info", message: `Meta title is only ${title.length} characters — expand toward 50–60.` })

    if (!fields.meta_description) issues.push({ severity: "warning", message: "Meta description uses the fallback — write 140–160 characters with the primary keyword." })
    else if (description.length > SEO_LIMITS.metaDescription.max) issues.push({ severity: "warning", message: `Meta description is ${description.length} characters — keep it under ${SEO_LIMITS.metaDescription.max}.` })
    else if (description.length < SEO_LIMITS.metaDescription.min) issues.push({ severity: "info", message: `Meta description is ${description.length} characters — aim for 140–160.` })

    if (!fields.primary_keyword) issues.push({ severity: "error", message: "No primary keyword — internal links and AI fill need one." })
    else if (title && !title.toLowerCase().includes(String(row!.primary_keyword).toLowerCase())) {
      issues.push({ severity: "info", message: "Primary keyword does not appear in the meta title." })
    }
    if (secondary.length < 4) issues.push({ severity: "warning", message: `${secondary.length}/4 secondary keywords — add ${4 - secondary.length} more.` })

    if (!hasImage && page.kind !== "static") issues.push({ severity: "error", message: "No image — run AI image fill or upload one." })
    if (hasImage && !fields.image_alt) issues.push({ severity: "warning", message: "Image has no alt text (AI fill can generate it from the keyword)." })
    if (!fields.og_title || !fields.og_description) issues.push({ severity: "info", message: "Open Graph title/description fall back to the meta values." })
    if (!fields.faqs && page.kind !== "blog") issues.push({ severity: "info", message: "No FAQs — FAQs help answer engines (AEO) quote this page." })
    if (!indexable) issues.push({ severity: "warning", message: "Page is set to noindex and is excluded from the sitemap." })

    const filled = Object.values(fields).filter(Boolean).length
    const score = Math.round((filled / Object.keys(fields).length) * 100)

    const tKey = title.trim().toLowerCase()
    if (tKey) titleCount.set(tKey, [...(titleCount.get(tKey) || []), page.path])
    const dKey = description.trim().toLowerCase()
    if (dKey) descCount.set(dKey, [...(descCount.get(dKey) || []), page.path])

    reports.push({ pageKey: page.pageKey, path: page.path, title: page.title, kind: page.kind, score, indexable, issues, fields })
  }

  const siteIssues: SeoReport["siteIssues"] = []
  for (const [, paths] of Array.from(titleCount.entries())) {
    if (paths.length > 1) siteIssues.push({ severity: "error", message: `Duplicate meta title on ${paths.join(", ")} — make each title unique.` })
  }
  for (const [, paths] of Array.from(descCount.entries())) {
    if (paths.length > 1) siteIssues.push({ severity: "warning", message: `Duplicate meta description on ${paths.join(", ")}.` })
  }
  for (const conflict of keywordMap.conflicts) {
    siteIssues.push({
      severity: "warning",
      message: `Keyword cannibalization: "${conflict.keyword}" is the primary keyword of ${conflict.pages.join(", ")} — give each page its own primary keyword.`,
    })
  }
  siteIssues.push({ severity: "info", message: `${keywordMap.links.length} keywords are mapped to pages for automatic internal linking.` })

  const all = reports.flatMap((r) => r.issues)
  return {
    generatedAt: new Date().toISOString(),
    averageScore: reports.length ? Math.round(reports.reduce((n, r) => n + r.score, 0) / reports.length) : 0,
    pages: reports.sort((a, b) => a.score - b.score),
    siteIssues,
    totals: {
      pages: reports.length,
      errors: all.filter((i) => i.severity === "error").length + siteIssues.filter((i) => i.severity === "error").length,
      warnings: all.filter((i) => i.severity === "warning").length + siteIssues.filter((i) => i.severity === "warning").length,
      missingImages: reports.filter((r) => !r.fields.image && r.kind !== "static").length,
      missingKeywords: reports.filter((r) => !r.fields.primary_keyword).length,
    },
  }
}
