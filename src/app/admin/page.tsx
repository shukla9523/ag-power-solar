"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminPath } from "@lib/hooks/use-admin-path"
import {
  Building2,
  ExternalLink,
  Check,
  Clock,
  Plus,
  Phone,
  FileText,
  Briefcase,
  BookOpen,
  Package,
  Inbox,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Card, ErrorBanner, PageHeader, StatTile, buttonGhost, buttonPrimary } from "./_components/ui"
import LeadsTrendChart from "./_components/LeadsTrendChart"
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

export default function AdminDashboard() {
  const { prefixPath } = useAdminPath()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [markingLeadId, setMarkingLeadId] = useState<string | null>(null)

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

  const seoLastRunHint = seo?.lastRun
    ? `${seo.errors} errors · ${seo.warnings} warnings · Last: ${formatRelativeTime(seo.lastRun)}`
    : seo ? `${seo.errors} errors · ${seo.warnings} warnings` : undefined

  return (
    <div className="space-y-6 pb-16">
      {/* ── Page Header with Company Profile Trigger ── */}
      <PageHeader
        title="Dashboard"
        description="Customer leads, solar hardware catalogue, and SEO visibility for AG POWER Solar at a glance."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:border-emerald-500 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>Company Profile (agpower.in ↗)</span>
            </button>
            <Link
              href={prefixPath("/admin/leads")}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-emerald-500 shadow-sm transition-all"
            >
              View All Leads
            </Link>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      {/* ── Quick Actions Row ── */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl border border-slate-800 bg-slate-900/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">Quick Actions:</span>
        <Link
          href={prefixPath("/admin/blog")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
        >
          <FileText className="h-3.5 w-3.5 text-emerald-400" />
          <span>+ New Blog Post</span>
        </Link>
        <Link
          href={prefixPath("/admin/services")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
        >
          <Briefcase className="h-3.5 w-3.5 text-sky-400" />
          <span>+ New Service</span>
        </Link>
        <Link
          href={prefixPath("/admin/case-studies")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
        >
          <BookOpen className="h-3.5 w-3.5 text-purple-400" />
          <span>+ New Case Study</span>
        </Link>
      </div>

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
          hint={`${leads?.total ?? 0} total enquiries`}
          href={prefixPath("/admin/leads?status=new")}
          tone="amber"
          loading={loading}
          unavailable={leads && !leads.available}
        />
        <StatTile
          label="SEO health"
          value={seo ? `${seo.averageScore}%` : undefined}
          hint={seoLastRunHint}
          href={prefixPath("/admin/seo/report")}
          tone="purple"
          loading={loading}
          unavailable={seo && !seo.available}
        />
      </div>

      {/* ── Content Counts Grid (Published + Drafts) ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Published posts"
          value={content?.blogPublished}
          hint={`${content?.blogDrafts ?? 0} draft posts`}
          href={prefixPath("/admin/blog")}
          tone="sky"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Services"
          value={content?.services}
          hint={`${content?.servicesDrafts ?? 0} drafts · EPC offerings`}
          href={prefixPath("/admin/services")}
          tone="emerald"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Case studies"
          value={content?.caseStudies}
          hint={`${content?.casesDrafts ?? 0} drafts · Verified sites`}
          href={prefixPath("/admin/case-studies")}
          tone="purple"
          loading={loading}
          unavailable={content && !content.available}
        />
        <StatTile
          label="Solar Products"
          value={content?.products}
          hint={`${content?.productsDrafts ?? 0} drafts · Solar panels`}
          href={prefixPath("/admin/products")}
          tone="amber"
          loading={loading}
          unavailable={content && !content.available}
        />
      </div>

      {/* ── Leads Trend, Source Breakdown & Status Breakdown ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Area Chart */}
        <Card title="Leads Trend — Last 30 Days" className="lg:col-span-2">
          {loading ? (
            <div className="h-56 animate-pulse rounded-xl bg-slate-800/50" />
          ) : (
            <LeadsTrendChart data={leads?.trend || []} />
          )}
        </Card>

        {/* Lead Status & Source Breakdown */}
        <div className="space-y-6">
          {/* Status Breakdown Card */}
          <Card title="Lead Status Breakdown">
            {loading ? (
              <div className="space-y-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-800/50" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    New / Unread
                  </span>
                  <span className="font-bold text-white text-[13px]">{leads?.statusBreakdown?.new ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-sky-400">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    Contacted
                  </span>
                  <span className="font-bold text-white text-[13px]">{leads?.statusBreakdown?.contacted ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
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
          <Card title="Top Lead Sources (30 Days)">
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
                      <li key={source} className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800">
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

      {/* ── Latest 5 Leads Table Card ── */}
      <Card
        title="Latest Customer Inquiries"
        action={
          <Link
            href={prefixPath("/admin/leads")}
            className="text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Manage all leads →
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800/50" />
            ))}
          </div>
        ) : !leads?.latestLeads || leads.latestLeads.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center">
            <Inbox className="h-6 w-6 text-slate-500 mb-2" />
            <p className="text-[13px] font-medium text-slate-300">No leads recorded yet</p>
            <p className="mt-1 text-[11px] text-slate-400">Customer quote inquiries will appear here dynamically.</p>
          </div>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Source Page</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Received</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leads.latestLeads.map((lead) => {
                  const isRead = lead.is_read || lead.status === "contacted" || lead.status === "closed"
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          {!isRead && <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />}
                          <span>{lead.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono text-[12px]">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{lead.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[12px] truncate max-w-[140px]">
                        {lead.source}
                      </td>
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
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[12px]">
                        {formatRelativeTime(lead.created_at)}
                      </td>
                      <td className="p-3.5 text-right">
                        {!isRead ? (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(lead.id)}
                            disabled={markingLeadId === lead.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Check className="h-3 w-3" />
                            <span>Mark read</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span>Read</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Company Profile Modal ── */}
      <CompanyProfileModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        profile={company || null}
      />
    </div>
  )
}
