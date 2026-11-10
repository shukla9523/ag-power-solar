/**
 * Purpose: analytics for the admin dashboard — leads (today / 7 d / 30 d / total, by source,
 * 30-day trend), content counts, SEO completeness, missing images, AI jobs and unread
 * notifications. Each block reports its own availability so the UI never shows a fake 0.
 * Cached for 60 s per warm instance.
 */
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { namedCache } from "@lib/util/ttl-cache"
import { buildSeoReport } from "@lib/services/seo-report"
import { forbidden, ok } from "@lib/util/api-response"

const cache = namedCache<Record<string, unknown>>("admin-stats", 60 * 1000, 2)

const DAY = 86_400_000

async function leadStats() {
  const since30 = new Date(Date.now() - 30 * DAY).toISOString()
  const [total, recent, unread] = await Promise.all([
    supabaseAdmin.from("contact_leads").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("contact_leads").select("created_at, source").gte("created_at", since30).limit(5000),
    supabaseAdmin.from("contact_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ])
  if (total.error || recent.error) return { available: false }

  const now = Date.now()
  const startOfToday = new Date(new Date().toDateString()).getTime()
  const rows = recent.data || []
  const trend: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now - i * DAY).toISOString().slice(0, 10)
    trend.push({ date: day, count: 0 })
  }
  const bySource: Record<string, number> = {}
  let today = 0
  let week = 0
  for (const r of rows) {
    const t = Date.parse(r.created_at)
    if (t >= startOfToday) today++
    if (t >= now - 7 * DAY) week++
    bySource[r.source || "contact"] = (bySource[r.source || "contact"] || 0) + 1
    const slot = trend.find((d) => d.date === r.created_at.slice(0, 10))
    if (slot) slot.count++
  }
  return { available: true, today, week, month: rows.length, total: total.count || 0, unread: unread.count || 0, bySource, trend }
}

async function contentStats() {
  const [blog, drafts, services, work] = await Promise.all([
    supabaseAdmin.from("post").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("status", "published"),
    supabaseAdmin.from("post").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("status", "draft"),
    supabaseAdmin.from("services").select("slug", { count: "exact", head: true }),
    supabaseAdmin.from("case_studies").select("id", { count: "exact", head: true }),
  ])
  if (blog.error || services.error) return { available: false }
  return {
    available: true,
    blogPublished: blog.count || 0,
    blogDrafts: drafts.count || 0,
    services: services.count || 0,
    caseStudies: work.count || 0,
  }
}

async function aiStats() {
  const { data, error } = await supabaseAdmin
    .from("ai_jobs")
    .select("type, status, filled_fields, finished_at")
    .order("created_at", { ascending: false })
    .limit(5)
  if (error) return { available: false }
  return { available: true, recent: data || [] }
}

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }

  const data = await cache.getOrSet("stats", async () => {
    const [leads, content, ai, seo] = await Promise.all([
      leadStats().catch(() => ({ available: false })),
      contentStats().catch(() => ({ available: false })),
      aiStats().catch(() => ({ available: false })),
      buildSeoReport()
        .then((r) => ({ available: true, averageScore: r.averageScore, ...r.totals }))
        .catch(() => ({ available: false })),
    ])
    return { leads, content, ai, seo, generatedAt: new Date().toISOString() }
  })

  // Backwards-compatible fields used by the previous dashboard.
  const content = data.content as { blogPublished?: number; services?: number }
  return ok({ ...data, blog: content.blogPublished ?? null, services: content.services ?? null })
}
