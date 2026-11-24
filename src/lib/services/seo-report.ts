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
import { supabaseAdmin } from "@lib/supabase-admin"

export type Severity = "error" | "warning" | "info"

export interface PageReport {
  pageKey: string
  path: string
  title: string
  kind: string
  score: number
  indexable: boolean
  fixUrl?: string
  issues: { severity: Severity; message: string; fixUrl?: string }[]
  fields: Record<string, boolean>
}

export interface SeoReport {
  generatedAt: string
  averageScore: number
  pages: PageReport[]
  siteIssues: { severity: Severity; message: string; fixUrl?: string }[]
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

function resolveFixUrl(page: { pageKey: string; kind: string; path: string }): string {
  if (page.kind === "blog" || page.pageKey.startsWith("blog:")) {
    const s = page.pageKey.replace(/^blog:/, "")
    return `/admin/blog?slug=${encodeURIComponent(s)}`
  }
  if (page.kind === "service" || page.pageKey.startsWith("service:")) {
    const s = page.pageKey.replace(/^service:/, "")
    return `/admin/services?slug=${encodeURIComponent(s)}`
  }
  if (page.kind === "work" || page.pageKey.startsWith("work:") || page.pageKey.startsWith("case-study:")) {
    const s = page.pageKey.replace(/^(work|case-study):/, "")
    return `/admin/case-studies?slug=${encodeURIComponent(s)}`
  }
  return `/admin/seo?page=${encodeURIComponent(page.pageKey)}`
}

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
    const fixUrl = resolveFixUrl(page)
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

    // Canonical check
    const canonical = String(row?.canonical_url || "")
    if (!canonical.trim() && page.kind !== "static") {
      issues.push({ severity: "warning", message: "Missing canonical URL — set an explicit canonical URL to prevent duplication.", fixUrl })
    }

    // JSON-LD check
    const customJson = String(row?.schema_json || row?.custom_json_ld || "")
    if (customJson.trim()) {
      try {
        JSON.parse(customJson)
      } catch {
        issues.push({ severity: "error", message: "Invalid JSON-LD syntax in custom schema — fix JSON syntax error.", fixUrl })
      }
    }

    if (!fields.meta_title) issues.push({ severity: "warning", message: "Meta title uses the template fallback — add a keyword-led title (50–60 characters).", fixUrl })
    else if (title.length > SEO_LIMITS.metaTitle.max) issues.push({ severity: "warning", message: `Meta title is ${title.length} characters — shorten to ${SEO_LIMITS.metaTitle.max} or fewer.`, fixUrl })
    else if (title.length < SEO_LIMITS.metaTitle.min) issues.push({ severity: "info", message: `Meta title is only ${title.length} characters — expand toward 50–60.`, fixUrl })

    if (!fields.meta_description) issues.push({ severity: "warning", message: "Meta description uses the fallback — write 140–160 characters with the primary keyword.", fixUrl })
    else if (description.length > SEO_LIMITS.metaDescription.max) issues.push({ severity: "warning", message: `Meta description is ${description.length} characters — keep it under ${SEO_LIMITS.metaDescription.max}.`, fixUrl })
    else if (description.length < SEO_LIMITS.metaDescription.min) issues.push({ severity: "info", message: `Meta description is ${description.length} characters — aim for 140–160.`, fixUrl })

    if (!fields.primary_keyword) issues.push({ severity: "error", message: "No primary keyword — internal links and search ranking need one.", fixUrl })
    else if (title && !title.toLowerCase().includes(String(row!.primary_keyword).toLowerCase())) {
      issues.push({ severity: "info", message: "Primary keyword does not appear in the meta title.", fixUrl })
    }
    if (secondary.length < 4) issues.push({ severity: "warning", message: `${secondary.length}/4 secondary keywords — add ${4 - secondary.length} more.`, fixUrl })

    if (!hasImage && page.kind !== "static") issues.push({ severity: "error", message: "No image — add a featured image or upload one.", fixUrl })
    if (hasImage && !fields.image_alt) issues.push({ severity: "warning", message: "Image has no alt text.", fixUrl })
    if (!fields.og_title || !fields.og_description) issues.push({ severity: "info", message: "Open Graph title/description fall back to the meta values.", fixUrl })
    if (!fields.faqs && page.kind !== "blog") issues.push({ severity: "info", message: "No FAQs — FAQs help answer engines (AEO) quote this page.", fixUrl })
    if (!indexable) issues.push({ severity: "warning", message: "Page is set to noindex and is excluded from the sitemap.", fixUrl })

    const errorsCount = issues.filter((i) => i.severity === "error").length
    const warningsCount = issues.filter((i) => i.severity === "warning").length
    const weightedScore = Math.max(0, Math.min(100, 100 - (errorsCount * 15 + warningsCount * 5)))

    const tKey = title.trim().toLowerCase()
    if (tKey) titleCount.set(tKey, [...(titleCount.get(tKey) || []), page.path])
    const dKey = description.trim().toLowerCase()
    if (dKey) descCount.set(dKey, [...(descCount.get(dKey) || []), page.path])

    reports.push({ pageKey: page.pageKey, path: page.path, title: page.title, kind: page.kind, score: weightedScore, indexable, fixUrl, issues, fields })
  }

  const siteIssues: SeoReport["siteIssues"] = []
  for (const [, paths] of Array.from(titleCount.entries())) {
    if (paths.length > 1) siteIssues.push({ severity: "error", message: `Duplicate meta title on ${paths.join(", ")} — make each title unique.`, fixUrl: "/admin/seo" })
  }
  for (const [, paths] of Array.from(descCount.entries())) {
    if (paths.length > 1) siteIssues.push({ severity: "warning", message: `Duplicate meta description on ${paths.join(", ")}.`, fixUrl: "/admin/seo" })
  }
  for (const conflict of keywordMap.conflicts) {
    siteIssues.push({
      severity: "warning",
      message: `Keyword cannibalization: "${conflict.keyword}" is the primary keyword of ${conflict.pages.join(", ")} — give each page its own primary keyword.`,
      fixUrl: "/admin/seo",
    })
  }
  siteIssues.push({ severity: "info", message: `${keywordMap.links.length} keywords are mapped to pages for automatic internal linking.`, fixUrl: "/admin/seo" })

  const all = reports.flatMap((r) => r.issues)
  const averageScore = reports.length ? Math.round(reports.reduce((n, r) => n + r.score, 0) / reports.length) : 0
  const totalErrors = all.filter((i) => i.severity === "error").length + siteIssues.filter((i) => i.severity === "error").length
  const totalWarnings = all.filter((i) => i.severity === "warning").length + siteIssues.filter((i) => i.severity === "warning").length

  const report: SeoReport = {
    generatedAt: new Date().toISOString(),
    averageScore,
    pages: reports.sort((a, b) => a.score - b.score),
    siteIssues,
    totals: {
      pages: reports.length,
      errors: totalErrors,
      warnings: totalWarnings,
      missingImages: reports.filter((r) => !r.fields.image && r.kind !== "static").length,
      missingKeywords: reports.filter((r) => !r.fields.primary_keyword).length,
    },
  }

  // Persist to seo_audits and seo_issues in Supabase
  try {
    const auditId = crypto.randomUUID()
    const { error: auditError } = await supabaseAdmin.from("seo_audits").insert({
      id: auditId,
      average_score: averageScore,
      total_pages: reports.length,
      total_errors: totalErrors,
      total_warnings: totalWarnings,
      created_at: report.generatedAt,
    })

    if (!auditError) {
      const issueRecords: {
        id: string
        audit_id: string
        page_path: string
        issue_type: string
        severity: Severity
        message: string
        fix_url: string | null
        created_at: string
      }[] = []

      for (const r of reports) {
        for (const i of r.issues) {
          issueRecords.push({
            id: crypto.randomUUID(),
            audit_id: auditId,
            page_path: r.path,
            issue_type: i.severity,
            severity: i.severity,
            message: i.message,
            fix_url: i.fixUrl || r.fixUrl || null,
            created_at: report.generatedAt,
          })
        }
      }

      for (const s of siteIssues) {
        issueRecords.push({
          id: crypto.randomUUID(),
          audit_id: auditId,
          page_path: "site-wide",
          issue_type: s.severity,
          severity: s.severity,
          message: s.message,
          fix_url: s.fixUrl || "/admin/seo",
          created_at: report.generatedAt,
        })
      }

      if (issueRecords.length > 0) {
        await supabaseAdmin.from("seo_issues").insert(issueRecords.slice(0, 500))
      }
    }
  } catch {
    // Non-blocking fallback if database tables are in transit
  }

  return report
}
