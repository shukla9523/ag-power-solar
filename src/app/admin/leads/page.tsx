"use client"

/**
 * Purpose: leads inbox — every contact-form submission (contact page, EDITZ, Blog AI) with
 * search, filters, status updates, notes, delivery status, CSV export and the Google Sheet link.
 */

import { useCallback, useEffect, useState } from "react"
import { Download, ExternalLink, Mail, Search } from "lucide-react"
import { Card, EmptyState, ErrorBanner, PageHeader, buttonGhost, inputClass } from "../_components/ui"

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  source: string
  source_page: string | null
  status: string
  notes: string | null
  sheet_status: string
  email_status: string
  created_at: string
}

const STATUSES = ["new", "contacted", "qualified", "closed", "spam"]
const SOURCES = [
  { value: "", label: "All sources" },
  { value: "contact", label: "Contact page" },
  { value: "editz", label: "EDITZ" },
  { value: "blog-ai", label: "Blog AI" },
]
const STATUS_STYLE: Record<string, string> = {
  new: "bg-brand/15 text-brand",
  contacted: "bg-accent-sky/15 text-accent-sky",
  qualified: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-slate-500/15 text-slate-300",
  spam: "bg-red-500/15 text-red-400",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("")
  const [source, setSource] = useState("")
  const [sheetUrl, setSheetUrl] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const limit = 25

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("status")
    if (initial) setStatus(initial)
  }, [])

  // Debounce search input (300 ms) so typing does not fire a request per key.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (query) params.set("q", query)
    if (status) params.set("status", status)
    if (source) params.set("source", source)
    try {
      const res = await fetch(`/api/admin/leads?${params}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load leads")
      setLeads(data.leads)
      setTotal(data.meta.total)
      setSheetUrl(data.sheetUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leads")
    } finally {
      setLoading(false)
    }
  }, [page, query, status, source])

  useEffect(() => {
    load()
  }, [load])

  async function update(lead: Lead, patch: Partial<Pick<Lead, "status" | "notes">>) {
    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      setError((await res.json().catch(() => null))?.error || "Could not update the lead")
      return
    }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, ...patch } : l)))
    setSelected((s) => (s && s.id === lead.id ? { ...s, ...patch } : s))
  }

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Every enquiry is saved here first, then copied to the Google Sheet and emailed through Zoho."
        actions={
          <>
            {sheetUrl && (
              <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className={buttonGhost}>
                <ExternalLink size={14} /> Open Google Sheet
              </a>
            )}
            <button type="button" onClick={() => (window.location.href = "/api/admin/leads/export")} className={buttonGhost}>
              <Download size={14} /> Export CSV
            </button>
          </>
        }
      />
      {error && <ErrorBanner message={error} />}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or subject" className={`${inputClass} pl-9`} />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={`${inputClass} w-auto`}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1) }} className={`${inputClass} w-auto`}>
          {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <Card>
        {loading && <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-admin-line/40" />)}</div>}
        {!loading && leads.length === 0 && !error && <EmptyState title="No leads match" description="New enquiries from the website appear here instantly." />}
        {!loading && leads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-3">Received</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-line">
                {leads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelected(lead)} className="cursor-pointer text-slate-200 hover:bg-admin-panel">
                    <td className="py-3 pr-4 text-slate-400">{new Date(lead.created_at).toLocaleString()}</td>
                    <td className="py-3 pr-4"><p className="font-semibold text-white">{lead.name}</p><p className="text-[11.5px] text-slate-500">{lead.email}</p></td>
                    <td className="max-w-[260px] truncate py-3 pr-4">{lead.subject}</td>
                    <td className="py-3 pr-4 text-slate-400">{lead.source}</td>
                    <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${STATUS_STYLE[lead.status] || ""}`}>{lead.status}</span></td>
                    <td className="py-3 text-[11px] text-slate-400">Sheet: {lead.sheet_status} · Email: {lead.email_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-400">
          <span>{total} lead(s)</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={buttonGhost}>Previous</button>
            <span className="self-center">Page {page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className={buttonGhost}>Next</button>
          </div>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-[90] flex justify-end bg-black/50" onClick={() => setSelected(null)}>
          <aside className="h-full w-full max-w-[520px] overflow-y-auto border-l border-admin-line bg-admin-bg-deep p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-bold text-white">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="mt-1 inline-flex items-center gap-1 text-[13px] text-brand"><Mail size={13} /> {selected.email}</a>
                {selected.phone && <p className="text-[13px] text-slate-400">{selected.phone}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white" aria-label="Close">✕</button>
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject</p>
            <p className="text-[14px] text-white">{selected.subject}</p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Message</p>
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-200">{selected.message}</p>
            <p className="mt-4 text-[11.5px] text-slate-500">From {selected.source}{selected.source_page ? ` · ${selected.source_page}` : ""} · {new Date(selected.created_at).toLocaleString()}</p>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => update(selected, { status: s })} className={`rounded-full px-3 py-1 text-[12px] font-semibold capitalize ${selected.status === s ? STATUS_STYLE[s] : "border border-admin-line text-slate-400 hover:text-white"}`}>{s}</button>
              ))}
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-slate-500">Notes</p>
            <textarea
              defaultValue={selected.notes || ""}
              onBlur={(e) => e.target.value !== (selected.notes || "") && update(selected, { notes: e.target.value })}
              rows={5}
              className={`${inputClass} mt-2`}
              placeholder="Internal notes (saved when you click outside)"
            />
          </aside>
        </div>
      )}
    </div>
  )
}
