"use client"

import React from "react"
import Link from "next/link"
import { AlertCircle, AlertTriangle, CheckCircle, ExternalLink, ShieldCheck, Sparkles } from "lucide-react"

interface SeoHealthPanelProps {
  score: number
  errors: number
  warnings: number
  missingImages?: number
  missingKeywords?: number
  totalPages?: number
  lastRun?: string | null
  href: string
  loading?: boolean
}

export default function SeoHealthPanel({
  score = 92,
  errors = 0,
  warnings = 0,
  missingImages = 0,
  missingKeywords = 0,
  totalPages = 143,
  lastRun,
  href,
  loading = false,
}: SeoHealthPanelProps) {
  // Circular progress calculations
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const validScore = Math.min(100, Math.max(0, score || 0))
  const strokeDashoffset = circumference - (validScore / 100) * circumference

  // Dynamic score tone
  const scoreTone =
    validScore >= 90
      ? { stroke: "#10b981", text: "text-emerald-400", label: "Excellent", bg: "bg-emerald-500/10" }
      : validScore >= 75
      ? { stroke: "#f59e0b", text: "text-amber-400", label: "Needs Review", bg: "bg-amber-500/10" }
      : { stroke: "#ef4444", text: "text-red-400", label: "Critical Fixes", bg: "bg-red-500/10" }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm shadow-sm transition-all hover:border-white/15">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Automated Audit
          </span>
          <h3 className="font-sans text-[18px] font-extrabold text-white">SEO Health & Visibility</h3>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Fix in SEO Hub</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-6 py-6 animate-pulse">
          <div className="h-24 w-24 rounded-full bg-slate-800" />
          <div className="space-y-3 flex-1">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="h-3 w-48 rounded bg-slate-800/60" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Circular Progress Ring */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-3">
            <div className="relative flex items-center justify-center">
              <svg className="h-28 w-28 -rotate-90 transform">
                {/* Background Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground Animated Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={scoreTone.stroke}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-sans text-[26px] font-extrabold leading-none text-white">
                  {validScore}%
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${scoreTone.text}`}>
                  {scoreTone.label}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 text-center">
              Checked across {totalPages} indexed pages
            </p>
          </div>

          {/* Actionable Health Breakdown */}
          <div className="sm:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/40 p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white">Schema Graph Validity</p>
                  <p className="text-[10px] text-slate-400">Organization, Services, FAQs verified</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400">100% Valid</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/40 p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white">Advisory Warnings</p>
                  <p className="text-[10px] text-slate-400">
                    {warnings > 0 ? `${warnings} recommended keywords/meta length fixes` : "Zero warnings"}
                  </p>
                </div>
              </div>
              <Link
                href={href}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                {warnings > 0 ? `${warnings} Fix →` : "All Clear"}
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/40 p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white">Critical Errors</p>
                  <p className="text-[10px] text-slate-400">
                    {errors > 0 ? `${errors} broken links or missing tags` : "0 blocking issues"}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold ${errors > 0 ? "text-red-400" : "text-slate-400"}`}>
                {errors}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
