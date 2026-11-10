"use client"

/**
 * Purpose: admin analytics dashboard — leads (today / 7 d / 30 d / total, by source,
 * 30-day trend), content, SEO health, AI jobs. Every tile shows "Data unavailable"
 * instead of a misleading 0 when its source fails.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import { Card, ErrorBanner, PageHeader, StatTile, buttonGhost, buttonPrimary } from "./_components/ui"

type Stats = {
  leads: { available: boolean; today?: number; week?: number; month?: number; total?: number; unread?: number; bySource?: Record<string, number>; trend?: { date: string; count: number }[] }
  content: { available: boolean; blogPublished?: number; blogDrafts?: number; services?: number; caseStudies?: number }
  seo: { available: boolean; averageScore?: number; errors?: number; warnings?: number; missingImages?: number; missingKeywords?: number; pages?: number }
  ai: { available: boolean; recent?: { type: string; status: string; filled_fields: number; finished_at: string }[] }
}

const SOURCE_LABEL: Record<string, string> = { contact: "Contact page", editz: "EDITZ", "blog-ai": "Blog AI", other: "Other" }

function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]" role="img" aria-label="Leads per day, last 30 days">
        {data.map((d) => (
          <div key={d.date} className="group relative flex-1">
            <div
              className="w-full rounded-t bg-brand/70 transition group-hover:bg-brand"
              style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-admin-bg-deep px-2 py-0.5 text-[10px] text-white group-hover:block">
              {d.date.slice(5)}: {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-slate-500">
        <span>{data[0]?.date.slice(5)}</span>
        <span>Today</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { prefixPath } = useAdminPath()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "Could not load the dashboard")
        setStats(await r.json())
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const loading = !stats && !error
  const leads = stats?.leads
  const content = stats?.content
  const seo = stats?.seo

  return (
    <div className="text-slate-200">
      <PageHeader
        title="Dashboard"
        description="Leads, content and SEO health for mommantum.com at a glance."
        actions={
          <>
            <Link href={prefixPath("/admin/blog/new")} className={buttonPrimary}>+ New blog post</Link>
            <Link href={prefixPath("/admin/seo/report")} className={buttonGhost}>Run SEO report</Link>
          </>
        }
      />
      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Leads today" value={leads?.today} hint="New enquiries since midnight" href={prefixPath("/admin/leads")} loading={loading} unavailable={leads && !leads.available} />
        <StatTile label="Leads · 7 days" value={leads?.week} hint={`${leads?.month ?? 0} in the last 30 days`} href={prefixPath("/admin/leads")} tone="emerald" loading={loading} unavailable={leads && !leads.available} />
        <StatTile label="Unread leads" value={leads?.unread} hint={`${leads?.total ?? 0} leads in total`} href={prefixPath("/admin/leads?status=new")} tone="amber" loading={loading} unavailable={leads && !leads.available} />
        <StatTile label="SEO health" value={`${seo?.averageScore ?? 0}%`} hint={`${seo?.errors ?? 0} errors · ${seo?.warnings ?? 0} warnings`} href={prefixPath("/admin/seo/report")} tone="purple" loading={loading} unavailable={seo && !seo.available} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Leads — last 30 days" className="lg:col-span-2">
          {loading && <div className="h-36 animate-pulse rounded-xl bg-admin-line/40" />}
          {leads?.available && leads.trend && <TrendChart data={leads.trend} />}
          {leads && !leads.available && <p className="text-[12.5px] text-slate-500">Lead analytics start after the 2026-11-08 database migration.</p>}
        </Card>

        <Card title="Leads by source (30 days)">
          {leads?.available && Object.keys(leads.bySource || {}).length === 0 && <p className="text-[12.5px] text-slate-500">No leads yet.</p>}
          <ul className="space-y-3">
            {Object.entries(leads?.bySource || {})
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => (
                <li key={source}>
                  <div className="flex justify-between text-[12.5px]">
                    <span className="text-slate-300">{SOURCE_LABEL[source] || source}</span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-admin-line">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(count / Math.max(1, leads?.month || 1)) * 100}%` }} />
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Published posts" value={content?.blogPublished} hint={`${content?.blogDrafts ?? 0} drafts`} href={prefixPath("/admin/blog")} tone="sky" loading={loading} unavailable={content && !content.available} />
        <StatTile label="Services" value={content?.services} href={prefixPath("/admin/services")} tone="emerald" loading={loading} unavailable={content && !content.available} />
        <StatTile label="Case studies" value={content?.caseStudies} href={prefixPath("/admin/case-studies")} tone="purple" loading={loading} unavailable={content && !content.available} />
        <StatTile label="Missing images" value={seo?.missingImages} hint={`${seo?.missingKeywords ?? 0} pages without a primary keyword`} href={prefixPath("/admin/seo/report")} tone="amber" loading={loading} unavailable={seo && !seo.available} />
      </div>

      <Card title="Recent AI jobs" className="mt-6">
        {stats?.ai?.available && (stats.ai.recent || []).length === 0 && <p className="text-[12.5px] text-slate-500">No AI jobs have run yet. The monthly job fills only empty meta fields.</p>}
        {stats?.ai && !stats.ai.available && <p className="text-[12.5px] text-slate-500">AI job history appears after the 2026-11-08 database migration.</p>}
        <ul className="divide-y divide-admin-line">
          {(stats?.ai?.recent || []).map((job, i) => (
            <li key={i} className="flex justify-between py-2.5 text-[12.5px]">
              <span className="text-slate-300">{job.type === "seo_fill" ? "Meta fill" : job.type}</span>
              <span className={job.status === "succeeded" ? "text-emerald-400" : "text-red-400"}>{job.status}</span>
              <span className="text-slate-400">{job.filled_fields} fields</span>
              <span className="text-slate-500">{job.finished_at ? new Date(job.finished_at).toLocaleString() : "—"}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
