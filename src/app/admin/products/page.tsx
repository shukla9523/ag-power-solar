"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Package,
  ExternalLink,
  Edit2,
  Check,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Search,
  RefreshCw,
} from "lucide-react"

interface ProductRow {
  id: string
  slug: string
  name: string
  brand: string
  technology: string
  wattage_range: string
  efficiency: string
  overview?: string
  badge?: string | null
  almm_listed: boolean
  dcr_compliant: boolean
  datasheet_url?: string
  gallery?: { src: string; alt?: string; label?: string }[]
  status?: string
}

const BADGE_OPTIONS = [
  "",
  "Highest Efficiency",
  "Most Popular",
  "Best Value",
  "Legacy Trust",
  "Designer Choice",
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products")
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase().trim()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.technology.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
    )
  }, [products, searchQuery])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    setSaveLoading(true)

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badge: editingProduct.badge || null,
          almm_listed: Boolean(editingProduct.almm_listed),
          dcr_compliant: Boolean(editingProduct.dcr_compliant),
          wattage_range: editingProduct.wattage_range,
          efficiency: editingProduct.efficiency,
          overview: editingProduct.overview,
          datasheet_url: editingProduct.datasheet_url,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setProducts((prev) =>
          prev.map((p) => (p.slug === editingProduct.slug ? { ...p, ...editingProduct } : p))
        )
        showToast(`Saved changes for ${editingProduct.brand} ${editingProduct.name}`)
        setEditingProduct(null)
      } else {
        showToast(json.error || "Failed to update product")
      }
    } catch {
      showToast("Network error. Could not save changes.")
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="pb-16 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-forest-deep border border-emerald-500/40 px-4 py-3 text-white shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-admin-line pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Solar Panels & Modules</h1>
          </div>
          <p className="mt-1 text-[13.5px] text-slate-400">
            Manage catalogue listings, ALMM certifications, DCR compliance badges, and technical datasheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            className="inline-flex items-center gap-1.5 rounded-lg border border-admin-line bg-admin-panel px-3 py-2 text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            href="/solar-panels"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-forest hover:bg-forest-deep px-4 py-2 text-[13px] font-bold text-white shadow-xs transition"
          >
            <span>View Live Catalogue</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-admin-line bg-admin-panel p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Panels</span>
          <p className="mt-1 text-2xl font-bold text-white">{products.length}</p>
        </div>
        <div className="rounded-xl border border-admin-line bg-admin-panel p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">ALMM Listed</span>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {products.filter((p) => p.almm_listed).length}
          </p>
        </div>
        <div className="rounded-xl border border-admin-line bg-admin-panel p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">DCR Approved</span>
          <p className="mt-1 text-2xl font-bold text-blue-400">
            {products.filter((p) => p.dcr_compliant).length}
          </p>
        </div>
        <div className="rounded-xl border border-admin-line bg-admin-panel p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Custom Badges</span>
          <p className="mt-1 text-2xl font-bold text-amber-400">
            {products.filter((p) => Boolean(p.badge)).length}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search panels by brand, name or badge..."
            className="w-full rounded-xl border border-admin-line bg-admin-panel py-2 pl-10 pr-4 text-[13.5px] text-white placeholder-slate-500 focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-admin-line bg-admin-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-admin-line bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Compliance</th>
                <th className="py-3 px-4">Gallery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-line">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading solar panel catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No panels matched your query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((panel) => {
                  const firstImg = panel.gallery?.[0]?.src || `/panels/${panel.slug}/main.webp`
                  return (
                    <tr key={panel.slug} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-white">
                            <Image
                              src={firstImg}
                              alt={panel.name}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                              {panel.brand}
                            </span>
                            <p className="font-semibold text-white leading-snug">{panel.name}</p>
                            <span className="text-[11.5px] text-slate-400">{panel.technology}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-300 font-medium">{panel.wattage_range}</div>
                        <div className="text-[11.5px] text-emerald-400 font-semibold">
                          {panel.efficiency} Eff.
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {panel.badge ? (
                          <span className="inline-flex items-center rounded-md bg-forest/80 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-bold text-white">
                            {panel.badge}
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-slate-500 italic">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {panel.almm_listed ? (
                            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-400">
                              <ShieldCheck className="h-3 w-3 text-blue-400" />
                              ALMM Listed
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-slate-500">Not Listed</span>
                          )}

                          {panel.dcr_compliant ? (
                            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-400">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              DCR Approved
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-slate-500">Non-DCR</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          {panel.gallery && panel.gallery.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-300">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              {panel.gallery.length} Images
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-amber-400 flex items-center gap-1">
                              <AlertCircle size={12} />
                              Needs images
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...panel })}
                            className="inline-flex items-center gap-1 rounded-lg border border-admin-line bg-slate-800 px-2.5 py-1.5 text-[12px] font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>

                          <Link
                            href={`/solar-panels/${panel.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg border border-admin-line bg-slate-800 px-2 py-1.5 text-[12px] font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition"
                            title="View on live site"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer / Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-admin-line bg-admin-panel p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-admin-line pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {editingProduct.brand}
                </span>
                <h2 className="text-xl font-bold text-white leading-snug">{editingProduct.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              {/* Badge Selection */}
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-300">
                  Marketing Badge (Leave empty to remove)
                </label>
                <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BADGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, badge: opt || null })}
                      className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold border transition ${
                        (editingProduct.badge || "") === opt
                          ? "bg-forest border-emerald-400 text-white"
                          : "bg-slate-900 border-admin-line text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {opt ? opt : "None"}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingProduct.badge || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, badge: e.target.value || null })
                  }
                  placeholder="Or type custom badge..."
                  className="mt-2 w-full rounded-lg border border-admin-line bg-slate-900 px-3 py-1.5 text-[12.5px] text-white focus:border-forest focus:outline-none"
                />
              </div>

              {/* Compliance Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-admin-line bg-slate-900/60 p-3.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.almm_listed}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, almm_listed: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-forest focus:ring-forest"
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-white">ALMM Listed</span>
                    <p className="text-[11.5px] text-slate-400">Shows ALMM Certified badge on product</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.dcr_compliant}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, dcr_compliant: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-forest focus:ring-forest"
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-white">DCR Compliant</span>
                    <p className="text-[11.5px] text-slate-400">PM Surya Ghar subsidy eligibility badge</p>
                  </div>
                </label>
              </div>

              {/* Wattage & Efficiency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-300">
                    Wattage Range
                  </label>
                  <input
                    type="text"
                    value={editingProduct.wattage_range}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, wattage_range: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-admin-line bg-slate-900 px-3 py-1.5 text-[13px] text-white focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-300">
                    Module Efficiency
                  </label>
                  <input
                    type="text"
                    value={editingProduct.efficiency}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, efficiency: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-admin-line bg-slate-900 px-3 py-1.5 text-[13px] text-white focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Datasheet URL */}
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-300">
                  Manufacturer Datasheet URL (PDF)
                </label>
                <input
                  type="text"
                  value={editingProduct.datasheet_url || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, datasheet_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-admin-line bg-slate-900 px-3 py-1.5 text-[13px] text-white focus:border-forest focus:outline-none"
                />
              </div>

              {/* Overview */}
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-300">
                  Engineering Overview
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.overview || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, overview: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-admin-line bg-slate-900 p-2.5 text-[13px] text-white focus:border-forest focus:outline-none"
                />
              </div>

              {/* Gallery Thumbnails Preview */}
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-300 mb-2">
                  Product Gallery (5 Verified Distinct Images)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(editingProduct.gallery || []).map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-[4/3] rounded-lg border border-slate-700 bg-white overflow-hidden"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || `Photo ${i + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="100px"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-medium text-white">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-admin-line">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-lg border border-admin-line px-4 py-2 text-[13px] font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest hover:bg-forest-deep px-5 py-2 text-[13px] font-bold text-white shadow-xs transition disabled:opacity-50"
                >
                  {saveLoading ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
