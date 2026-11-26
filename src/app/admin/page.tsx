"use client"

import React, { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import {
  Building2,
  ExternalLink,
  Check,
  Plus,
  Phone,
  FileText,
  Briefcase,
  BookOpen,
  Package,
  Inbox,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  MessageCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Card, ErrorBanner, StatCard } from "./_components/ui"
import LeadsTrendChart from "./_components/LeadsTrendChart"
import SeoHealthPanel from "./_components/SeoHealthPanel"
import ContentOverviewCard from "./_components/ContentOverviewCard"
import CompanyProfileModal, { CompanyProfileData } from "./_components/CompanyProfileModal"

type LeadItem = {
  id: string
  name: string
  phone: string
  email: string
  source: string
  status: string
  is_read: boolean
  created_at: string
}

type Stats = {
  leads: {
    available: boolean
    today: number
    week: number
    month: number
    total: number
    unread: number
    statusBreakdown: { new: number; contacted: number; closed: number }
    latestLeads: LeadItem[]
    bySource: Record<string, number>
    trend: { date: string; displayDate: string; leads: number; count: number }[]
  }
  content: {
    available: boolean
    blogPublished: number
    blogDrafts: number
    services: number
    servicesDrafts?: number
    caseStudies: number
    casesDrafts?: number
    products: number
    productsDrafts?: number
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
  company?: CompanyProfileData | null
}

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "Never"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays}d ago`
}

function getGreeting(name = "Akash"): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 17) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}

export default function AdminDashboard() {
  const { prefixPath } = useAdminPath()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [markingLeadId, setMarkingLeadId] = useState<string | null>(null)
  const [leadsPeriod, setLeadsPeriod] = useState<"today" | "7d" | "30d">("today")
  const [formattedDate, setFormattedDate] = useState<string>("")

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    )
  }, [])

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

  async function handleMarkRead(leadId: string) {
    setMarkingLeadId(leadId)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true, status: "contacted" }),
      })
      if (res.ok) {
        setStats((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            leads: {
              ...prev.leads,
              unread: Math.max(0, prev.leads.unread - 1),
              latestLeads: prev.leads.latestLeads.map((l) =>
                l.id === leadId ? { ...l, is_read: true, status: "contacted" } : l
              ),
              statusBreakdown: {
                ...prev.leads.statusBreakdown,
                new: Math.max(0, (prev.leads.statusBreakdown?.new || 0) - 1),
                contacted: (prev.leads.statusBreakdown?.contacted || 0) + 1,
              },
            },
          }
        })
      }
    } catch {
      // ignore
    } finally {
      setMarkingLeadId(null)
    }
  }

  const loading = !stats && !error
  const leads = stats?.leads
  const content = stats?.content
  const seo = stats?.seo
  const company = stats?.company

  // Selected value for the Leads KPI Card
  const currentLeadsValue = useMemo(() => {
    if (!leads) return 0
    if (leadsPeriod === "today") return leads.today ?? 0
    if (leadsPeriod === "7d") return leads.week ?? 0
    return leads.month ?? 0
  }, [leads, leadsPeriod])

  const currentLeadsSubValue = useMemo(() => {
    if (leadsPeriod === "today") return "Enquiries since midnight IST"
    if (leadsPeriod === "7d") return "Trailing 7-day inquiries"
    return "Trailing 30-day inquiries"
  }, [leadsPeriod])

  const leadTrendSparkline = useMemo(() => {
    if (!leads?.trend || leads.trend.length === 0) return [1, 2, 1, 3, 2, 4, 3]
    return leads.trend.slice(-7).map((t) => t.count || t.leads || 0)
  }, [leads])

  return (
    <div className="space-y-6 pb-16">
      {/* ── 1. Greeting Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational HQ</span>
            {formattedDate && <span className="text-slate-400">· {formattedDate}</span>}
          </div>
          <h1 className="mt-1 font-sans text-[22px] sm:text-[26px] font-extrabold tracking-tight text-white">
            {getGreeting("Akash")}
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Real-time customer enquiries, solar equipment catalogue, and SEO health overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCompanyModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-[13px] font-semibold text-slate-200 shadow-sm hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span>Company Profile ↗</span>
          </button>
          <Link
            href={prefixPath("/admin/leads")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-emerald-500 hover:shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>View All Leads</span>
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* ── 2. Quick Actions Bar (Compact Pill Row) ── */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-3 backdrop-blur-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Quick Actions:</span>
        </span>
        <Link
          href={prefixPath("/admin/blog/new")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white transition-all"
        >
          <FileText className="h-3.5 w-3.5 text-emerald-400" />
          <span>+ New Blog Post</span>
        </Link>
        <Link
          href={prefixPath("/admin/services/new")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Briefcase className="h-3.5 w-3.5 text-sky-400" />
          <span>+ New Service</span>
        </Link>
        <Link
          href={prefixPath("/admin/case-studies/new")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white transition-all"
        >
          <BookOpen className="h-3.5 w-3.5 text-purple-400" />
          <span>+ New Case Study</span>
        </Link>
      </div>

      {/* ── 3. 4 Core KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Inbound Leads with Time Range Toggle */}
        <StatCard
          label="Inbound Leads"
          value={currentLeadsValue}
          subValue={currentLeadsSubValue}
          trend={{
            direction: "up",
            text: `${leads?.month ?? 0} in 30 days`,
          }}
          icon={<Users className="h-4 w-4" />}
          tone="emerald"
          href={prefixPath("/admin/leads")}
          loading={loading}
          unavailable={leads && !leads.available}
          sparklineData={leadTrendSparkline}
          tabs={{
            active: leadsPeriod,
            options: [
              { label: "Today", value: "today" },
              { label: "7D", value: "7d" },
              { label: "30D", value: "30d" },
            ],
            onChange: (val) => setLeadsPeriod(val as "today" | "7d" | "30d"),
          }}
        />

        {/* KPI 2: Unread Leads */}
        <StatCard
          label="Unread Leads"
          value={leads?.unread ?? 0}
          subValue={`${leads?.statusBreakdown?.new ?? 0} waiting response`}
          trend={{
            direction: (leads?.unread ?? 0) > 0 ? "up" : "neutral",
            text: (leads?.unread ?? 0) > 0 ? "Action required" : "All cleared",
          }}
          icon={<Inbox className="h-4 w-4" />}
          tone={(leads?.unread ?? 0) > 0 ? "amber" : "slate"}
          href={prefixPath("/admin/leads?status=new")}
          loading={loading}
          unavailable={leads && !leads.available}
          sparklineData={[2, 1, 3, 2, 0, (leads?.unread ?? 0)]}
        />

        {/* KPI 3: SEO Health */}
        <StatCard
          label="SEO Health"
          value={seo ? `${seo.averageScore}%` : "—"}
          subValue={`${seo?.errors ?? 0} errors · ${seo?.warnings ?? 0} warnings`}
          trend={{
            direction: (seo?.averageScore ?? 0) >= 90 ? "up" : "down",
            text: (seo?.averageScore ?? 0) >= 90 ? "Optimal score" : "Review needed",
          }}
          icon={<ShieldCheck className="h-4 w-4" />}
          tone={(seo?.averageScore ?? 0) >= 90 ? "emerald" : "amber"}
          href={prefixPath("/admin/seo/report")}
          loading={loading}
          unavailable={seo && !seo.available}
          sparklineData={[85, 88, 89, 90, 91, 92, (seo?.averageScore ?? 92)]}
        />

        {/* KPI 4: Solar Products */}
        <StatCard
          label="Solar Products"
          value={content?.products ?? 0}
          subValue={`${content?.productsDrafts ?? 0} drafts · Catalogue items`}
          trend={{
            direction: "neutral",
            text: "Tier-1 Hardware",
          }}
          icon={<Package className="h-4 w-4" />}
          tone="sky"
          href={prefixPath("/admin/products")}
          loading={loading}
          unavailable={content && !content.available}
          sparklineData={[4, 5, 5, 6, 6, 6, (content?.products ?? 6)]}
        />
      </div>

      {/* ── 4. Wide Leads Trend Area Chart & Lead Status Breakdown ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {loading ? (
              <div className="h-64 animate-pulse rounded-xl bg-slate-800/50" />
            ) : (
              <LeadsTrendChart data={leads?.trend || []} />
            )}
          </Card>
        </div>

        {/* Lead Status & Source Breakdown (1 Col) */}
        <div className="space-y-6">
          <Card title="Status Pipeline">
            {loading ? (
              <div className="space-y-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-800/50" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-slate-950/40">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    New / Unread
                  </span>
                  <span className="font-bold text-white text-[13px]">{leads?.statusBreakdown?.new ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-slate-950/40">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-sky-400">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    Contacted
                  </span>
                  <span className="font-bold text-white text-[13px]">{leads?.statusBreakdown?.contacted ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-slate-950/40">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Closed / Won
                  </span>
                  <span className="font-bold text-white text-[13px]">{leads?.statusBreakdown?.closed ?? 0}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Top Sources */}
          <Card title="Top Lead Sources (30D)">
            {loading ? (
              <div className="space-y-3 pt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-800/50" />
                ))}
              </div>
            ) : Object.keys(leads?.bySource || {}).length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <p className="text-[13px] font-medium text-slate-300">No lead sources recorded</p>
                <p className="mt-1 text-[11px] text-slate-400">Sources appear once customer forms are submitted.</p>
              </div>
            ) : (
              <ul className="space-y-2.5 pt-1">
                {Object.entries(leads?.bySource || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([source, count]) => {
                    const percent = Math.round((count / Math.max(1, leads?.month || 1)) * 100)
                    return (
                      <li key={source} className="rounded-xl bg-slate-950/40 p-2.5 border border-white/[0.08]">
                        <div className="flex justify-between text-[12px]">
                          <span className="font-semibold text-slate-200 truncate">{source}</span>
                          <span className="font-bold text-emerald-400 shrink-0 ml-2">
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800">
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
      </div>

      {/* ── 5. SEO Health Panel & Content Overview Card Grid ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SEO Health Panel with Circular Progress Ring */}
        <SeoHealthPanel
          score={seo?.averageScore ?? 92}
          errors={seo?.errors ?? 0}
          warnings={seo?.warnings ?? 0}
          missingImages={seo?.missingImages ?? 0}
          missingKeywords={seo?.missingKeywords ?? 0}
          totalPages={seo?.totalPages ?? 143}
          lastRun={seo?.lastRun}
          href={prefixPath("/admin/seo/report")}
          loading={loading}
        />

        {/* Unified Content Overview Card */}
        <ContentOverviewCard
          blogPublished={content?.blogPublished ?? 0}
          blogDrafts={content?.blogDrafts ?? 0}
          services={content?.services ?? 0}
          servicesDrafts={content?.servicesDrafts ?? 0}
          caseStudies={content?.caseStudies ?? 0}
          casesDrafts={content?.casesDrafts ?? 0}
          products={content?.products ?? 0}
          productsDrafts={content?.productsDrafts ?? 0}
          prefixPath={prefixPath}
          loading={loading}
        />
      </div>

      {/* ── 6. Recent Enquiries Interactive Table ── */}
      <Card
        title="Recent Customer Enquiries"
        action={
          <Link
            href={prefixPath("/admin/leads")}
            className="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
          >
            <span>View All Leads →</span>
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-800/50" />
            ))}
          </div>
        ) : !leads?.latestLeads || leads.latestLeads.length === 0 ? (
          <div className="flex h-44 flex-col items-center justify-center text-center rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-6">
            <Inbox className="h-8 w-8 text-slate-500 mb-2" />
            <p className="text-[13px] font-semibold text-white">No customer enquiries recorded yet</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Inbound quote requests from residential, commercial, or housing society pages will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-slate-950/30">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Service / Source</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Received</th>
                  <th className="p-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {leads.latestLeads.map((lead) => {
                  const isRead = lead.is_read || lead.status === "contacted" || lead.status === "closed"
                  const rawPhone = lead.phone || ""
                  const digitsOnly = rawPhone.replace(/[^0-9]/g, "")
                  const waNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        !isRead
                          ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                          : "hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Name + Unread indicator */}
                      <td className="p-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          {!isRead && (
                            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 shadow-xs shadow-amber-400/50" />
                          )}
                          <span>{lead.name}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 text-slate-300 font-mono text-[12px]">
                        {rawPhone ? (
                          <a
                            href={`tel:${rawPhone.replace(/\s+/g, "")}`}
                            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{rawPhone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="p-3.5 text-slate-400 text-[12px] truncate max-w-[140px]">
                        {lead.source}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            lead.status === "new"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : lead.status === "contacted"
                              ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {lead.status === "new" ? "New" : lead.status === "contacted" ? "Contacted" : "Closed"}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="p-3.5 text-slate-400 text-[12px]">
                        {formatRelativeTime(lead.created_at)}
                      </td>

                      {/* Quick Actions: Call, WhatsApp, Mark Read */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {rawPhone && (
                            <>
                              <a
                                href={`tel:${rawPhone.replace(/\s+/g, "")}`}
                                title={`Call ${lead.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-pointer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp ${lead.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            </>
                          )}

                          {!isRead ? (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(lead.id)}
                              disabled={markingLeadId === lead.id}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                              <span>Mark read</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 px-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span>Read</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── 7. Company Profile Modal ── */}
      <CompanyProfileModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        profile={company || null}
      />
    </div>
  )
}
