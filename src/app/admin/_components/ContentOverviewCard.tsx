"use client"

import React from "react"
import Link from "next/link"
import { FileText, Briefcase, BookOpen, Package, Plus, ArrowRight } from "lucide-react"

interface ContentItemStats {
  published: number
  drafts: number
  label: string
  href: string
  newHref: string
  icon: React.ReactNode
  accentColor: string
}

interface ContentOverviewCardProps {
  blogPublished?: number
  blogDrafts?: number
  services?: number
  servicesDrafts?: number
  caseStudies?: number
  casesDrafts?: number
  products?: number
  productsDrafts?: number
  prefixPath: (href: string) => string
  loading?: boolean
}

export default function ContentOverviewCard({
  blogPublished = 8,
  blogDrafts = 0,
  services = 3,
  servicesDrafts = 0,
  caseStudies = 9,
  casesDrafts = 0,
  products = 6,
  productsDrafts = 0,
  prefixPath,
  loading = false,
}: ContentOverviewCardProps) {
  const contentItems: ContentItemStats[] = [
    {
      label: "Blog Articles",
      published: blogPublished,
      drafts: blogDrafts,
      href: prefixPath("/admin/blog"),
      newHref: prefixPath("/admin/blog/new"),
      icon: <FileText className="h-4 w-4 text-emerald-400" />,
      accentColor: "bg-emerald-500",
    },
    {
      label: "Service Offerings",
      published: services,
      drafts: servicesDrafts,
      href: prefixPath("/admin/services"),
      newHref: prefixPath("/admin/services/new"),
      icon: <Briefcase className="h-4 w-4 text-sky-400" />,
      accentColor: "bg-sky-500",
    },
    {
      label: "Case Studies",
      published: caseStudies,
      drafts: casesDrafts,
      href: prefixPath("/admin/case-studies"),
      newHref: prefixPath("/admin/case-studies/new"),
      icon: <BookOpen className="h-4 w-4 text-purple-400" />,
      accentColor: "bg-purple-500",
    },
    {
      label: "Solar Panels Catalogue",
      published: products,
      drafts: productsDrafts,
      href: prefixPath("/admin/products"),
      newHref: prefixPath("/admin/products"),
      icon: <Package className="h-4 w-4 text-amber-400" />,
      accentColor: "bg-amber-500",
    },
  ]

  const totalPublished = blogPublished + services + caseStudies + products
  const totalDrafts = blogDrafts + servicesDrafts + casesDrafts + productsDrafts

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm shadow-sm transition-all hover:border-white/15">
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-4 mb-4 gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Content Engine
          </span>
          <h3 className="font-sans text-[18px] font-extrabold text-white">Content Overview</h3>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-400 border border-emerald-500/20">
            {totalPublished} Published
          </span>
          {totalDrafts > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-bold text-amber-400 border border-amber-500/20">
              {totalDrafts} Drafts
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/60 px-2.5 py-0.5 font-medium text-slate-500">
              0 Drafts
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {contentItems.map((item) => {
            const total = item.published + item.drafts
            const publishedPct = total > 0 ? Math.round((item.published / total) * 100) : 100

            return (
              <div
                key={item.label}
                className="group relative rounded-xl border border-white/[0.08] bg-slate-950/40 p-3.5 transition-all hover:border-emerald-500/30 hover:bg-slate-950/70"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/80">
                      {item.icon}
                    </div>
                    <div>
                      <Link
                        href={item.href}
                        className="text-[13px] font-bold text-white group-hover:text-emerald-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] mt-0.5">
                        <span className="font-semibold text-white">{item.published} live</span>
                        <span className="text-slate-600">·</span>
                        <span className={item.drafts > 0 ? "text-amber-400 font-semibold" : "text-slate-500"}>
                          {item.drafts} draft{item.drafts === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={item.newHref}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-slate-800/60 text-slate-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                      title={`New ${item.label}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={item.href}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-white transition-colors"
                      title="Manage section"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-2.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${item.accentColor} transition-all duration-500`}
                    style={{ width: `${publishedPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
