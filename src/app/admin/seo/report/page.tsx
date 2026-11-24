"use client"

/**
 * Purpose: on-demand SEO / AEO / GEO report. Runs the audit when asked, shows site-wide and
 * per-page issues, and lets the team fill EMPTY meta fields and missing images with AI.
 */

import { useState } from "react"
import Link from "next/link"
import { Download, ImagePlus, PlayCircle, Sparkles } from "lucide-react"
import { Card, EmptyState, ErrorBanner, PageHeader, StatTile, buttonGhost, buttonPrimary } from "../../_components/ui"

type Issue = { severity: "error" | "warning" | "info"; message: string; fixUrl?: string }
type PageRow = { pageKey: string; path: string; title: string; kind: string; score: number; indexable: boolean; fixUrl?: string; issues: Issue[] }
type Report = {
  generatedAt: string
  averageScore: number
  pages: PageRow[]
  siteIssues: Issue[]
  totals: { pages: number; errors: number; warnings: number; missingImages: number; missingKeywords: number }
}

const SEVERITY: Record<Issue["severity"], string> = {
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-slate-400",
}

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 50) return "text-amber-400"
  return "text-red-400"
}

export default function SeoReportPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobMessage, setJobMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "issues">("issues")

  async function run() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/seo/report", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not build the report")
      setReport(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the report")
    } finally {
      setLoading(false)
    }
  }

  async function job(kind: "meta" | "images", pageKey?: string) {
    setBusy(`${kind}:${pageKey || "all"}`)
    setJobMessage(null)
    try {
      const res = await fetch(kind === "meta" ? "/api/admin/jobs/seo-auto-fill" : "/api/admin/jobs/image-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageKey ? { pageKey } : { limit: kind === "meta" ? 50 : 5 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Job failed")
      const result = data.data || {}
      setJobMessage(
        kind === "meta"
          ? `${data.message} ${result.errors?.length ? `Errors: ${result.errors.slice(0, 3).join("; ")}` : ""}`
          : `Generated ${result.generated?.length || 0} image(s). ${result.errors?.length ? `Errors: ${result.errors.slice(0, 3).join("; ")}` : ""}`
      )
      await run()
    } catch (e) {
      setJobMessage(e instanceof Error ? e.message : "Job failed")
    } finally {
      setBusy(null)
    }
  }

  const rows = (report?.pages || []).filter((p) => filter === "all" || p.issues.some((i) => i.severity !== "info"))

  return (
    <div>
      <PageHeader
        title="SEO Report"
        description="Audit every page's meta object, keywords, images, FAQs and indexing. AI fills only fields that are empty — anything already written stays exactly as it is."
        actions={
          <>
            <button onClick={run} disabled={loading} className={buttonPrimary}>
              <PlayCircle size={15} /> {loading ? "Analysing…" : report ? "Re-run report" : "Run report"}
            </button>
            {report && (
              <a href="/api/admin/seo/report?format=csv" className={buttonGhost}>
                <Download size={14} /> CSV
              </a>
            )}
          </>
        }
      />
      {error && <ErrorBanner message={error} />}
      {jobMessage && <div className="mb-6 rounded-xl border border-accent-purple/30 bg-accent-purple/10 px-4 py-3 text-[13px] text-slate-200">{jobMessage}</div>}

      {!report && !loading && <EmptyState title="No report yet" description="Click “Run report” to audit every page on ag-power-solar.vercel.app." />}
      {loading && !report && <div className="h-40 animate-pulse rounded-2xl bg-admin-line/40" />}

      {report && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatTile label="Average score" value={`${report.averageScore}%`} tone="purple" />
            <StatTile label="Pages audited" value={report.totals.pages} tone="sky" />
            <StatTile label="Errors" value={report.totals.errors} tone="brand" />
            <StatTile label="Warnings" value={report.totals.warnings} tone="amber" />
            <StatTile label="Missing images" value={report.totals.missingImages} tone="emerald" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => job("meta")} disabled={!!busy} className={buttonGhost}>
              <Sparkles size={14} /> {busy === "meta:all" ? "Filling…" : "AI: fill empty meta fields (all pages)"}
            </button>
            <button onClick={() => job("images")} disabled={!!busy} className={buttonGhost}>
              <ImagePlus size={14} /> {busy === "images:all" ? "Generating…" : "AI: generate missing images"}
            </button>
          </div>

          <Card title="Site-wide" className="mt-6">
            <ul className="space-y-2">
              {report.siteIssues.map((issue, i) => (
                <li key={i} className={`flex items-start justify-between gap-3 text-[13px] ${SEVERITY[issue.severity]}`}>
                  <span>• {issue.message}</span>
                  {issue.fixUrl && (
                    <Link href={issue.fixUrl} className="shrink-0 text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100">
                      Fix ↗
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Pages"
            className="mt-6"
            action={
              <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | "issues")} className="rounded-lg border border-admin-line bg-admin-bg px-2 py-1 text-[12px] text-slate-200">
                <option value="issues">Pages with errors / warnings</option>
                <option value="all">All pages</option>
              </select>
            }
          >
            <div className="divide-y divide-admin-line">
              {rows.map((p) => (
                <details key={p.pageKey} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center gap-4">
                    <span className={`w-12 text-[15px] font-extrabold ${scoreTone(p.score)}`}>{p.score}%</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-white">{p.title}</span>
                      <span className="block text-[11.5px] text-slate-500">{p.path} · {p.kind}{p.indexable ? "" : " · noindex"}</span>
                    </span>
                    <span className="text-[11.5px] text-slate-400">{p.issues.length} issue(s)</span>
                  </summary>
                  <div className="mt-3 pl-16">
                    <div className="mb-2 flex items-center gap-2">
                      {p.fixUrl && (
                        <Link href={p.fixUrl} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 border border-brand/30 px-2.5 py-1 text-[11.5px] font-semibold text-brand hover:bg-brand/20">
                          Fix Page Details & SEO ↗
                        </Link>
                      )}
                      <button onClick={() => job("meta", p.pageKey)} disabled={!!busy} className={`${buttonGhost}`}>
                        <Sparkles size={13} /> {busy === `meta:${p.pageKey}` ? "Filling…" : "Fill empty fields with AI"}
                      </button>
                    </div>
                    <ul className="space-y-1.5">
                      {p.issues.map((issue, i) => (
                        <li key={i} className={`flex items-start justify-between gap-3 text-[12.5px] ${SEVERITY[issue.severity]}`}>
                          <span>• {issue.message}</span>
                          {issue.fixUrl && (
                            <Link href={issue.fixUrl} className="shrink-0 text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100">
                              Fix ↗
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </Card>
          <p className="mt-4 text-[11.5px] text-slate-500">Generated {new Date(report.generatedAt).toLocaleString()}</p>
        </>
      )}
    </div>
  )
}
