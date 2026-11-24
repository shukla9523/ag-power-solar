"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, ExternalLink, Mail, Search, CheckCircle, Eye, EyeOff, MessageSquare } from "lucide-react"
import { Card, EmptyState, ErrorBanner, PageHeader, buttonGhost, buttonPrimary, inputClass } from "../_components/ui"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  source_page?: string | null
  source?: string | null
  status: string
  is_read?: boolean
  notes: string | null
  created_at: string
}

const STATUSES = ["new", "contacted", "closed"]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("")
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const limit = 25

  // Debounce search input
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

    try {
      const res = await fetch(`/api/admin/leads?${params}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load leads")
      setLeads(data.leads || [])
      setTotal(data.meta?.total || 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leads")
    } finally {
      setLoading(false)
    }
  }, [page, query, status])

  useEffect(() => {
    load()
  }, [load])

  async function updateLead(leadId: string, patch: Partial<Lead>) {
    setUpdatingId(leadId)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || "Update failed")
      }
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...patch } : l)))
      if (selected && selected.id === leadId) {
        setSelected((s) => (s ? { ...s, ...patch } : null))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update lead")
    } finally {
      setUpdatingId(null)
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Leads"
        description="Direct rooftop solar quote requests, inquiries, and customer contact submissions."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => (window.location.href = "/api/admin/leads/export")}
              className={`${buttonGhost} border-slate-700 hover:border-emerald-500`}
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      {/* ── Filters Bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[280px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lead name, phone, or email..."
            className={`${inputClass} pl-10 border-slate-800 bg-slate-900`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} w-auto border-slate-800 bg-slate-900 cursor-pointer font-medium`}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* ── Leads Table ── */}
      <Card>
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-800/40" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="When users submit the Solar Quote or Contact form, their details will display here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3.5 pl-2">Status</th>
                  <th className="pb-3.5">Customer Name & Contact</th>
                  <th className="pb-3.5">Inquiry / Message</th>
                  <th className="pb-3.5">Source Page</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leads.map((lead) => {
                  const isRead = lead.is_read !== false && lead.status !== "new"
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelected(lead)}
                      className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${
                        !isRead ? "bg-emerald-950/10 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 pl-2" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                            lead.status === "new"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : lead.status === "contacted"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-white text-[13.5px]">{lead.name}</p>
                        <p className="text-[12px] text-slate-300 font-normal">
                          {lead.phone ? `${lead.phone} • ` : ""}
                          <span className="text-slate-400">{lead.email}</span>
                        </p>
                      </td>
                      <td className="max-w-[260px] truncate py-3.5 text-slate-200">
                        {lead.message}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-emerald-300">
                          {lead.source_page || lead.source || "/"}
                        </span>
                      </td>
                      <td className="py-3.5 text-[12px] text-slate-400 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 pr-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => updateLead(lead.id, { is_read: !lead.is_read })}
                            title={lead.is_read ? "Mark unread" : "Mark read"}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            {lead.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-emerald-400" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelected(lead)}
                            className="rounded-lg border border-slate-700 px-2.5 py-1 text-[11.5px] font-bold text-slate-200 hover:bg-slate-800 hover:text-white"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-[12px] text-slate-400">
          <span>
            Showing <strong className="text-white">{leads.length}</strong> of{" "}
            <strong className="text-white">{total}</strong> leads
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={`${buttonGhost} px-3 py-1 text-[12px] disabled:opacity-30`}
            >
              Previous
            </button>
            <span className="px-2 font-mono text-slate-300">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className={`${buttonGhost} px-3 py-1 text-[12px] disabled:opacity-30`}
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* ── Lead Detail Modal ── */}
      {selected && (
        <Modal
          isOpen={Boolean(selected)}
          onClose={() => setSelected(null)}
          title={`Lead: ${selected.name}`}
          description={`Submitted on ${new Date(selected.created_at).toLocaleString()}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-950 p-4 border border-slate-800">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Email Address</p>
                <a href={`mailto:${selected.email}`} className="text-[13px] font-semibold text-emerald-400 hover:underline">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Phone Number</p>
                <a href={`tel:${selected.phone}`} className="text-[13px] font-semibold text-white hover:underline">
                  {selected.phone || "Not provided"}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => updateLead(selected.id, { status: e.target.value })}
                  className="mt-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[12px] text-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Source Page</p>
                <p className="text-[12px] font-mono text-slate-300">{selected.source_page || selected.source || "/"}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Customer Message</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Internal Notes</p>
              <textarea
                rows={3}
                defaultValue={selected.notes || ""}
                onBlur={(e) => updateLead(selected.id, { notes: e.target.value })}
                placeholder="Add notes about customer rooftop size, quote given, or call follow-up..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-[13px] text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
