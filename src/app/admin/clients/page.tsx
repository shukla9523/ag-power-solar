"use client"

/**
 * Purpose: Clients & Sheet Leads section in Mommantum Administration.
 * Strictly dynamic: renders the exact rows and columns from the connected Google Sheet.
 * No hardcoded entries — reflects only real live sheet data.
 */

import { useCallback, useEffect, useState } from "react"
import {
  Download,
  ExternalLink,
  Eye,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Table as TableIcon,
  X,
  Check,
  Copy,
  Clock,
  Sparkles,
} from "lucide-react"
import { Card, EmptyState, ErrorBanner, PageHeader, buttonGhost, buttonPrimary, inputClass } from "../_components/ui"

interface SheetRow {
  id: string
  rowNumber: number
  values: string[]
  record: Record<string, string>
}

export default function ClientsPage() {
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<SheetRow[]>([])
  const [totalInSheet, setTotalInSheet] = useState(0)
  const [sheetUrl, setSheetUrl] = useState("")
  const [sheetTitle, setSheetTitle] = useState("Google Sheet")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  // Selected Row for slide-over drawer
  const [selectedRow, setSelectedRow] = useState<SheetRow | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Add Entry Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  })
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  // Load Sheet Data
  const loadSheetData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    params.set("sort", sortOrder)

    try {
      const res = await fetch(`/api/admin/clients?${params}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load Google Sheet data")

      setHeaders(data.headers || [])
      setRows(data.rows || [])
      setTotalInSheet(data.totalInSheet || data.total || 0)
      if (data.sheetUrl) setSheetUrl(data.sheetUrl)
      if (data.title) setSheetTitle(data.title)
      if (data.lastUpdated) setLastUpdated(data.lastUpdated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sheet data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [searchQuery, sortOrder])

  useEffect(() => {
    loadSheetData()
  }, [loadSheetData])

  // Copy to clipboard helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Export current view as CSV
  const handleExportCSV = () => {
    if (headers.length === 0 || rows.length === 0) return

    const escapeCSV = (val: string) => {
      const s = String(val || "").replace(/"/g, '""')
      return `"${s}"`
    }

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => headers.map((h) => escapeCSV(row.record[h] || "")).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `mommantum-leads-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Handle Add Entry Form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddSubmitting(true)
    setAddError(null)
    setAddSuccess(false)

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to append entry")

      setAddSuccess(true)
      setAddForm({ name: "", email: "", subject: "", message: "", phone: "" })
      setTimeout(() => {
        setIsAddModalOpen(false)
        setAddSuccess(false)
        loadSheetData(true)
      }, 1000)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to append entry")
    } finally {
      setAddSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Clients & Leads"
        description={`Live sync with ${sheetTitle}. Showing only rows and columns present in your Google Sheet.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadSheetData(true)}
              disabled={loading || refreshing}
              className={`${buttonGhost} text-[13px]`}
              title="Refresh from Google Sheet"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-brand" : ""} />
              {refreshing ? "Syncing..." : "Refresh"}
            </button>

            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonGhost} text-[13px] text-slate-300 hover:text-white`}
              >
                <ExternalLink size={14} />
                Open Google Sheet
              </a>
            )}

            <button
              onClick={handleExportCSV}
              disabled={rows.length === 0}
              className={`${buttonGhost} text-[13px]`}
              title="Export visible rows to CSV"
            >
              <Download size={14} />
              Export CSV
            </button>

            <button onClick={() => setIsAddModalOpen(true)} className={`${buttonPrimary} text-[13px]`}>
              <Plus size={14} />
              Add Row
            </button>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      {/* Search & Filter Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search across all sheet columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10 pr-4 text-[13.5px]`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[12.5px] font-medium text-slate-400">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
            className={`${inputClass} py-1.5 text-[13px] bg-admin-input`}
          >
            <option value="desc">Newest First (Sheet Bottom)</option>
            <option value="asc">Sheet Order (Row 2 → End)</option>
          </select>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-admin-line bg-admin-panel/80 px-3 py-1.5 text-[12px] font-medium text-slate-300">
            <TableIcon size={13} className="text-brand" />
            <span>{rows.length} {rows.length === 1 ? "entry" : "entries"}</span>
            {totalInSheet !== rows.length && (
              <span className="text-slate-500">/ {totalInSheet} total</span>
            )}
          </span>
        </div>
      </div>

      {/* Main Dynamic Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-brand" />
            <p className="text-[14px] font-medium text-slate-300">Fetching live entries from Google Sheet...</p>
            <p className="text-[12px] text-slate-500 mt-1">Reading actual rows and columns via Google Sheets API</p>
          </div>
        ) : headers.length === 0 || rows.length === 0 ? (
          <div className="py-16 text-center">
            <EmptyState
              title={searchQuery ? "No matching entries" : "Google Sheet is empty"}
              description={
                searchQuery
                  ? `No sheet rows matched "${searchQuery}". Try clearing the search filter.`
                  : "No submissions are present in the Google Sheet yet. New submissions will appear here automatically."
              }
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")} className={`${buttonGhost} text-[13px] mt-4`}>
                Clear Search
              </button>
            ) : (
              <button onClick={() => setIsAddModalOpen(true)} className={`${buttonPrimary} text-[13px] mt-4`}>
                <Plus size={14} />
                Add First Row
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-admin-line bg-admin-panel/90 text-[11.5px] uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  {headers.map((colName) => (
                    <th key={colName} className="py-3 px-4 whitespace-nowrap">
                      {colName}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-line/50">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Row Index / Sheet Row Number */}
                    <td className="py-3.5 px-4 text-center font-mono text-[11.5px] text-slate-500">
                      {row.rowNumber}
                    </td>

                    {/* Dynamic Columns exactly from the Google Sheet */}
                    {headers.map((colName) => {
                      const val = row.record[colName] || ""
                      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
                      const isTimestamp = colName.toLowerCase().includes("time") || colName.toLowerCase().includes("date")

                      return (
                        <td key={colName} className="py-3.5 px-4 max-w-[280px]">
                          {isEmail ? (
                            <a
                              href={`mailto:${val}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-brand hover:underline font-medium"
                            >
                              <Mail size={12} className="text-brand/70" />
                              <span className="truncate">{val}</span>
                            </a>
                          ) : isTimestamp ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-300 whitespace-nowrap">
                              <Clock size={12} className="text-slate-500" />
                              {val}
                            </span>
                          ) : (
                            <span
                              className="text-slate-200 block truncate"
                              title={val}
                            >
                              {val || <span className="text-slate-600">—</span>}
                            </span>
                          )}
                        </td>
                      )
                    })}

                    {/* View Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedRow(row)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Slide-over details drawer for inspecting complete row content */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-admin-panel border-l border-admin-line h-full flex flex-col p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-admin-line mb-6">
              <div>
                <h3 className="text-[17px] font-bold text-white flex items-center gap-2">
                  <TableIcon size={16} className="text-brand" />
                  Sheet Row #{selectedRow.rowNumber}
                </h3>
                <p className="text-[12px] text-slate-400 mt-0.5">Exact cell values from Google Sheet</p>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Field breakdown */}
            <div className="space-y-4 flex-1">
              {headers.map((header) => {
                const val = selectedRow.record[header] || ""
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

                return (
                  <div key={header} className="rounded-xl border border-admin-line bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11.5px] uppercase font-semibold tracking-wider text-slate-400">
                        {header}
                      </span>
                      {val && (
                        <button
                          onClick={() => handleCopy(val, header)}
                          className="text-[11px] text-slate-400 hover:text-brand inline-flex items-center gap-1 transition"
                          title="Copy value"
                        >
                          {copiedKey === header ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isEmail ? (
                      <a
                        href={`mailto:${val}`}
                        className="text-[14px] font-medium text-brand hover:underline break-all block"
                      >
                        {val}
                      </a>
                    ) : (
                      <p className="text-[13.5px] text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                        {val || <span className="text-slate-600 italic">Empty</span>}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-admin-line mt-6 flex items-center justify-between">
              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonGhost} text-[12.5px]`}
                >
                  <ExternalLink size={13} />
                  Edit in Sheet
                </a>
              )}
              <button
                onClick={() => setSelectedRow(null)}
                className={`${buttonPrimary} text-[12.5px]`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl border border-admin-line bg-admin-panel p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-admin-line mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand/10 text-brand">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white">Add Row to Google Sheet</h3>
                  <p className="text-[12px] text-slate-400">Directly appends a new row to your sheet in real time.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {addError && <div className="mb-4 text-[13px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">{addError}</div>}
            {addSuccess && <div className="mb-4 text-[13px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">Row appended successfully to Google Sheet!</div>}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-medium text-slate-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanjay Choudhary"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={`${inputClass} w-full text-[13px]`}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sanjay@example.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className={`${inputClass} w-full text-[13px]`}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 95234 67849"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className={`${inputClass} w-full text-[13px]`}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Performance Marketing"
                  value={addForm.subject}
                  onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
                  className={`${inputClass} w-full text-[13px]`}
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  rows={3}
                  placeholder="Inquiry or notes..."
                  value={addForm.message}
                  onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                  className={`${inputClass} w-full text-[13px] resize-none`}
                />
              </div>

              <div className="pt-4 border-t border-admin-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`${buttonGhost} text-[13px]`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className={`${buttonPrimary} text-[13px]`}
                >
                  {addSubmitting ? "Appending..." : "Append Row"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
