"use client"

/**
 * Purpose: Audit Log (owner / admin) — every admin, AI and API change with who / what / when,
 * a before → after diff of the changed fields, and one-click restore.
 */

import { useCallback, useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { Card, EmptyState, ErrorBanner, PageHeader, buttonGhost, inputClass } from "../_components/ui"

type Entry = {
  id: string
  actor_email: string | null
  actor_type: string
  action: string
  entity_type: string
  entity_key: string
  changed_fields: string[]
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  restored_from: string | null
  created_at: string
}

const RESTORABLE = new Set(["post", "service", "case_study", "seo"])
const ENTITY_TYPES = ["", "post", "service", "case_study", "seo", "site", "user", "lead", "keyword", "product"]

function show(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  const text = typeof value === "string" ? value : JSON.stringify(value)
  return text.length > 180 ? `${text.slice(0, 180)}…` : text
}

export default function AuditPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState("")
  const [actor, setActor] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const limit = 30

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (entityType) params.set("entity_type", entityType)
    if (actor.trim()) params.set("actor", actor.trim())
    try {
      const res = await fetch(`/api/admin/audit?${params}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load the audit log")
      setEntries(data.entries)
      setTotal(data.meta.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the audit log")
    } finally {
      setLoading(false)
    }
  }, [page, entityType, actor])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  async function restore(entry: Entry) {
    if (!window.confirm(`Restore ${entry.entity_type} "${entry.entity_key}" to how it was before this change?`)) return
    setBusy(entry.id)
    setNotice(null)
    setError(null)
    const res = await fetch(`/api/admin/audit/${entry.id}/restore`, { method: "POST" })
    const data = await res.json().catch(() => null)
    setBusy(null)
    if (res.ok) {
      setNotice(data?.message || "Restored")
      load()
    } else {
      setError(data?.error || "Restore failed")
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <PageHeader title="Audit Log" description="Who changed what and when — including AI fills and the publishing API. Restore any content or SEO change in one click." />
      {error && <ErrorBanner message={error} />}
      {notice && <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">{notice}</div>}

      <div className="mb-4 flex flex-wrap gap-3">
        <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1) }} className={`${inputClass} w-auto`}>
          {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t || "All types"}</option>)}
        </select>
        <input value={actor} onChange={(e) => { setActor(e.target.value); setPage(1) }} placeholder="Filter by person (email)" className={`${inputClass} max-w-[280px]`} />
      </div>

      <Card>
        {loading && <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-admin-line/40" />)}</div>}
        {!loading && !error && entries.length === 0 && <EmptyState title="No changes recorded yet" description="Every save, delete, AI fill and restore will appear here." />}
        <ul className="divide-y divide-admin-line">
          {entries.map((entry) => (
            <li key={entry.id} className="py-3">
              <details>
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="w-[150px] text-[12px] text-slate-500">{new Date(entry.created_at).toLocaleString()}</span>
                  <span className="rounded-md bg-admin-panel px-2 py-0.5 text-[11.5px] font-semibold text-brand">{entry.action}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-white">{entry.entity_type} · {entry.entity_key}</span>
                  <span className="text-[12px] text-slate-400">{entry.actor_email || entry.actor_type}</span>
                </summary>
                <div className="mt-3 rounded-xl border border-admin-line bg-admin-bg p-3">
                  {entry.changed_fields.length === 0 && <p className="text-[12px] text-slate-500">Created or deleted — no field diff.</p>}
                  <table className="w-full text-left text-[12px]">
                    <tbody>
                      {entry.changed_fields.map((field) => (
                        <tr key={field} className="align-top">
                          <td className="w-[160px] py-1 pr-3 font-semibold text-slate-300">{field}</td>
                          <td className="py-1 pr-3 text-red-300/90 line-through decoration-red-400/40">{show(entry.before?.[field])}</td>
                          <td className="py-1 text-emerald-300">{show(entry.after?.[field])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {RESTORABLE.has(entry.entity_type) && entry.before && (
                    <button onClick={() => restore(entry)} disabled={busy === entry.id} className={`${buttonGhost} mt-3`}>
                      <RotateCcw size={13} /> {busy === entry.id ? "Restoring…" : "Restore the version before this change"}
                    </button>
                  )}
                  {entry.restored_from && <p className="mt-2 text-[11.5px] text-slate-500">This was a restore of entry {entry.restored_from}.</p>}
                </div>
              </details>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-400">
          <span>{total} change(s)</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={buttonGhost}>Previous</button>
            <span className="self-center">Page {page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className={buttonGhost}>Next</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
