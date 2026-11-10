/**
 * Purpose: shared admin UI primitives (page header, cards, stat tiles, states) so every
 * admin screen looks the same and has loading / empty / error states (SOP design rule).
 */

import Link from "next/link"

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-white">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13.5px] text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-admin-line bg-admin-panel/60 p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-[14px] font-bold text-white">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function StatTile({
  label,
  value,
  hint,
  href,
  tone = "brand",
  loading,
  unavailable,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  href?: string
  tone?: "brand" | "emerald" | "sky" | "amber" | "purple"
  loading?: boolean
  unavailable?: boolean
}) {
  const toneClass = {
    brand: "text-brand",
    emerald: "text-emerald-400",
    sky: "text-accent-sky",
    amber: "text-amber-400",
    purple: "text-accent-purple",
  }[tone]

  const body = (
    <div className="h-full rounded-2xl border border-admin-line bg-admin-panel/60 p-5 transition hover:border-brand/40">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className={`mt-2 text-[30px] font-extrabold tracking-[-0.03em] ${unavailable ? "text-slate-500" : toneClass}`}>
        {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-admin-line" /> : unavailable ? "—" : value}
      </p>
      <p className="mt-1 text-[11.5px] text-slate-500">{unavailable ? "Data unavailable" : hint}</p>
    </div>
  )
  return href ? <Link href={href}>{body}</Link> : body
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
      {message}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-admin-line px-6 py-12 text-center">
      <p className="text-[14px] font-semibold text-slate-200">{title}</p>
      {description && <p className="mt-1 text-[12.5px] text-slate-500">{description}</p>}
    </div>
  )
}

export const buttonPrimary =
  "inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-brand-hover disabled:opacity-50"
export const buttonGhost =
  "inline-flex items-center gap-2 rounded-xl border border-admin-line bg-admin-panel px-4 py-2.5 text-[13px] font-semibold text-slate-200 transition hover:border-brand/50 hover:text-white disabled:opacity-50"
export const inputClass =
  "w-full rounded-xl border border-admin-line bg-admin-bg px-3.5 py-2.5 text-[13px] text-white outline-none transition placeholder:text-slate-500 focus:border-brand"
