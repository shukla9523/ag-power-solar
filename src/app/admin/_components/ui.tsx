"use client"

/**
 * Purpose: Shared Admin UI primitives adhering to the Modern SaaS design system:
 * - 3 text sizes: label (11px uppercase), body (13px), heading (20px)
 * - Low-contrast borders (border-white/[0.08])
 * - Meaningful semantic colors (emerald=good, amber=warning, red=error, sky=info, slate=empty)
 * - Interactive StatCard with mini sparkline, hover lift, toggle tabs, and clickthrough
 */

import React, { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from "lucide-react"

// ── 1. Page Header ──
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-sans text-[22px] sm:text-[24px] font-extrabold tracking-tight text-white">
          {title}
        </h1>
        {description && <p className="mt-1 text-[13px] text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}

// ── 2. Card Container ──
export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm shadow-sm transition-all hover:border-white/15 ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
          {title && <h2 className="font-sans text-[16px] font-bold text-white">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

// ── 3. Interactive StatCard with Sparkline & Hover Lift ──
interface StatCardProps {
  label: string
  value: React.ReactNode
  subValue?: string
  trend?: {
    direction: "up" | "down" | "neutral"
    text: string
  }
  icon: React.ReactNode
  tone?: "emerald" | "amber" | "red" | "sky" | "slate"
  href?: string
  loading?: boolean
  unavailable?: boolean
  sparklineData?: number[]
  tabs?: {
    active: string
    options: { label: string; value: string }[]
    onChange: (val: string) => void
  }
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  icon,
  tone = "emerald",
  href,
  loading = false,
  unavailable = false,
  sparklineData = [3, 5, 2, 8, 6, 9, 7],
  tabs,
}: StatCardProps) {
  const toneMap = {
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      sparkline: "#10b981",
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      sparkline: "#f59e0b",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      sparkline: "#ef4444",
    },
    sky: {
      text: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
      sparkline: "#38bdf8",
    },
    slate: {
      text: "text-slate-400",
      bg: "bg-slate-800/50",
      border: "border-slate-700/40",
      sparkline: "#64748b",
    },
  }[tone]

  // Mini SVG Sparkline generator
  const maxVal = Math.max(...sparklineData, 1)
  const minVal = Math.min(...sparklineData, 0)
  const range = maxVal - minVal || 1
  const width = 80
  const height = 24
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width
      const y = height - ((val - minVal) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const content = (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer">
      {/* Top row: Label, Icon, and Tabs if any */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneMap.border} ${toneMap.bg} ${toneMap.text}`}>
              {icon}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </span>
          </div>

          {tabs && (
            <div
              className="flex items-center rounded-lg border border-white/[0.08] bg-slate-950/80 p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {tabs.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => tabs.onChange(opt.value)}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                    tabs.active === opt.value
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Metric Value */}
        <div className="mt-3.5 flex items-baseline justify-between gap-3">
          <div className={`font-sans text-[28px] font-extrabold tracking-tight ${unavailable ? "text-slate-500" : "text-white"}`}>
            {loading ? (
              <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
            ) : unavailable ? (
              "—"
            ) : (
              value
            )}
          </div>

          {/* Mini Sparkline */}
          {!loading && !unavailable && (
            <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <svg width={width} height={height} className="overflow-visible">
                <polyline
                  fill="none"
                  stroke={toneMap.sparkline}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Trend badge & helper note */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/[0.05] text-[11px]">
        {trend ? (
          <div
            className={`inline-flex items-center gap-1 font-semibold ${
              trend.direction === "up"
                ? "text-emerald-400"
                : trend.direction === "down"
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : trend.direction === "down" ? (
              <ArrowDownRight className="h-3.5 w-3.5" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
            <span>{trend.text}</span>
          </div>
        ) : (
          <span className="text-slate-500">{subValue || "Live data"}</span>
        )}

        {subValue && trend && <span className="text-slate-400 truncate max-w-[120px]">{subValue}</span>}
      </div>
    </div>
  )

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  )
}

// ── 4. Empty State ──
export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  actionText?: string
  actionHref?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-12 text-center backdrop-blur-sm">
      {icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-400">
          {icon}
        </div>
      )}
      <p className="text-[14px] font-semibold text-white">{title}</p>
      {description && <p className="mt-1 text-[12px] text-slate-400 max-w-sm mx-auto">{description}</p>}
      {(actionText && (actionHref || onAction)) && (
        <div className="mt-4">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[12.5px] font-bold text-white shadow-sm hover:bg-emerald-500 transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── 5. Error Banner ──
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300"
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      <span>{message}</span>
    </div>
  )
}

// ── 6. Confirm Dialog ──
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <h3 className="font-sans text-[18px] font-bold text-white">{title}</h3>
        <p className="mt-2 text-[13px] text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-[13px] font-bold text-white shadow-sm transition ${
              isDestructive ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Backward-compatible button constants & StatTile
export const buttonPrimary =
  "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 cursor-pointer shadow-xs"
export const buttonGhost =
  "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-[13px] font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-white disabled:opacity-50 cursor-pointer"
export const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-[13px] text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"

export function StatTile(props: any) {
  return (
    <StatCard
      label={props.label}
      value={props.value}
      subValue={props.hint}
      icon={<span className="h-2 w-2 rounded-full bg-current" />}
      tone={props.tone === "brand" ? "emerald" : props.tone}
      href={props.href}
      loading={props.loading}
      unavailable={props.unavailable}
    />
  )
}
