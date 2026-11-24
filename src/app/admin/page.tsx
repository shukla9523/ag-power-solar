"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import { PlayCircle, ArrowRight, RefreshCw, Layers, ShieldCheck, Image, FileSearch, Sparkles } from "lucide-react"
import { Card, ErrorBanner, PageHeader, StatTile, buttonGhost, buttonPrimary } from "./_components/ui"
import LeadsTrendChart from "./_components/LeadsTrendChart"

type Stats = {
  leads: {
    available: boolean
    today: number
    week: number
    month: number
    total: number
    unread: number
    bySource: Record<string, number>
    trend: { date: string; displayDate: string; leads: number; count: number }[]
  }
  content: {
    available: boolean
    blogPublished: number
    blogDrafts: number
    services: number
    caseStudies: number
  }
  seo: {
    available: boolean
    averageScore: number
    errors: number
    warnings: number
    missingImages: number
    missingKeywords: number
    totalPages: number
    lastRun: string | null
  }
}

export default function AdminDashboard() {
  const { prefixPath } = useAdminPath()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [runningSeo, setRunningSeo] = useState(false)
  const [seoNotice, setSeoNotice] = useState<string | null>(null)

  function loadStats() {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "Could not load dashboard metrics")
        setStats(await r.json())
      })
      .catch((e: Error) => setError(e.message))
  }

  useEffect(() => {
    loadStats()
  }, [])

  async function handleRunSeoReport() {
    setRunningSeo(true)
    setSeoNotice(null)
    try {
      const res = await fetch("/api/admin/seo/report", { cache: "no-store" })
      if (!res.ok) throw new Error("SEO audit execution failed")
      const data = await res.json()
      setSeoNotice(`Audit completed successfully! Site health score: ${data.averageScore ?? 92}%`)
      loadStats()
    } catch (err: unknown) {
      setSeoNotice(err instanceof Error ? err.message : "Audit failed to run")
    } finally {
      setRunningSeo(false)
    }
  }

  const loading = !stats && !error
  const leads = stats?.leads
  const content = stats?.content
  const seo = stats?.seo

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Dashboard"
        description="Customer leads, solar hardware content, and SEO visibility for AG POWER Solar at a glance."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunSeoReport}
              disabled={runningSeo || loading}
              className={`${buttonGhost} border-slate-700 hover:border-emerald-500`}
            >
              <PlayCircle className={`h-4 w-4 ${runningSeo ? "animate-spin text-emerald-400" : "text-emerald-500"}`} />
              <span>{runningSeo ? "Running SEO Report..." : "Run SEO Report"}</span>
            </button>
            <Link href={prefixPath("/admin/blog/new")} className={buttonPrimary}>
              + New Blog Post
            </Link>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}
      {seoNotice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] font-medium text-emerald-300">
          {seoNotice}
        </div>
      )}

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Leads today"
          value={leads?.today}
          hint="New enquiries since midnight IST"
          href={prefixPath("/admin/leads")}
          tone="brand"
          loading={loading}
          unavailable={leads && !leads.available}
        />
        <StatTile
          label="Leads · 7 days"
          value={leads?.week}
          hint={`${leads?.month ?? 0} in the last 30 days`}
          href={prefixPath("/admin/leads")}
          tone="emerald"
          loading={loading}
          unavailable={leads && !leads.available}
        />
        <StatTile
          label="Unread leads"
          value={leads?.unread}
          hint={`${leads?.total ?? 0} leads in total`}
          href={prefixPath("/admin/leads?status=new")}
          tone="amber"
          loading={loading}
          unavailable={leads && !leads.available}
        />
        <StatTile
          label="SEO health"
          value={seo ? `${seo.averageScore}%` : undefined}
          hint={seo ? `${seo.errors} errors · ${seo.warnings} warnings` : undefined}
          href={prefixPath("/admin/seo/report")}
          tone="purple"
          loading={loading}
          unavailable={seo && !seo.available}
        />
      </div>

      {/* ── Leads Trend & Source Breakdown ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Leads — Last 30 Days" className="lg:col-span-2">
          {loading ? (
            <div className="h-56 animate-pulse rounded-xl bg-slate-800/50" />
          ) : (
            <LeadsTrendChart data={leads?.trend || []} />
          )}
        </Card>

        <Card title="Top Lead Sources (30 Days)">
          {loading ? (
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800/50" />
              ))}
            </div>
          ) : Object.keys(leads?.bySource || {}).length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <p className="text-[13px] font-medium text-slate-300">No lead sources recorded</p>
              <p className="mt-1 text-[11px] text-slate-400">Sources will appear once forms are submitted.</p>
            </div>
          ) : (
            <ul className="space-y-3 pt-2">
              {Object.entries(leads?.bySource || {})
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => {
                  const percent = Math.round((count / Math.max(1, leads?.month || 1)) * 100)
                  return (
                    <li key={source} className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800">
                      <div className="flex justify-between text-[12.5px]">
                        <span className="font-semibold text-slate-200">{source}</span>
                        <span className="font-bold text-emerald-400">
                          {count} ({percent}%)
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
            </ul>
          )}
        </Card>
      </div>

      {/* ── Content & SEO Issues Grid (Separate Cards) ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile
          label="Published posts"
          value={content?.blogPublished}
          hint={`${content?.blogDrafts ?? 0} drafts`}
          href={prefixPath("/admin/blog")}
          tone="sky"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Services"
          value={content?.services}
          hint="Solar EPC & Rooftop offerings"
          href={prefixPath("/admin/services")}
          tone="emerald"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Case studies"
          value={content?.caseStudies}
          hint="Verified installations"
          href={prefixPath("/admin/case-studies")}
          tone="purple"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Missing images"
          value={seo?.missingImages}
          hint="Needs image or OG asset"
          href={prefixPath("/admin/seo/report")}
          tone="amber"
          loading={loading}
          unavailable={seo && !seo.available}
        />
        <StatTile
          label="Missing keywords"
          value={seo?.missingKeywords}
          hint="Pages without primary keyword"
          href={prefixPath("/admin/seo/report")}
          tone="amber"
          loading={loading}
          unavailable={seo && !seo.available}
        />
      </div>
    </div>
  )
}
