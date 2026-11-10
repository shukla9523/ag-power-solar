"use client"

/**
 * Purpose: reusable media library picker for admin editors — browse uploaded images,
 * upload a new one (validated server-side: PNG/JPEG/WebP/GIF, ≤ 5 MB) and pick it.
 */

import { useEffect, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"

type MediaItem = { name: string; url: string }

export default function MediaPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaItem[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/blog/images", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load images")
      setItems(data.images || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is larger than 5 MB")
      return
    }
    setLoading(true)
    setError(null)
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "")
      reader.onerror = () => reject(new Error("Could not read the file"))
      reader.readAsDataURL(file)
    }).catch((e: Error) => {
      setError(e.message)
      return ""
    })
    if (!data) {
      setLoading(false)
      return
    }
    const res = await fetch("/api/admin/blog/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, data }),
    })
    const body = await res.json().catch(() => null)
    setLoading(false)
    if (!res.ok || !body?.url) {
      setError(body?.error || "Upload failed")
      return
    }
    onSelect(body.url)
    setOpen(false)
  }

  const visible = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-charcoal bg-admin-bg px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:border-brand hover:text-white"
      >
        <ImageIcon size={13} /> Choose from media library
      </button>

      {open && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-admin-line bg-admin-bg-deep" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-admin-line px-5 py-3">
              <p className="text-[14px] font-bold text-white">Media library</p>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[12px] font-bold text-white hover:bg-brand-hover">
                  <Upload size={13} /> Upload
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                </label>
                <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close"><X size={18} /></button>
              </div>
            </div>
            <div className="p-5">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search images" className="mb-4 w-full rounded-xl border border-admin-line bg-admin-bg px-3.5 py-2 text-[13px] text-white outline-none focus:border-brand" />
              {error && <p className="mb-3 text-[12.5px] text-red-400">{error}</p>}
              {loading && <p className="text-[12.5px] text-slate-400">Loading…</p>}
              <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                {visible.map((item) => (
                  <button key={item.name} type="button" onClick={() => { onSelect(item.url); setOpen(false) }} className="group overflow-hidden rounded-xl border border-admin-line text-left hover:border-brand">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail grid */}
                    <img src={item.url} alt={item.name} loading="lazy" className="aspect-video w-full object-cover" />
                    <span className="block truncate px-2 py-1 text-[10.5px] text-slate-400 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
              </div>
              {!loading && visible.length === 0 && <p className="text-[12.5px] text-slate-500">No images yet — upload one.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
