"use client"

/**
 * Purpose: admin notification bell — unread badge, dropdown list, mark as read.
 * Polls every 60 s while the tab is visible (no polling in background tabs).
 */

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"

interface AdminNotification {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  read_at: string | null
  created_at: string
}

const TYPE_DOT: Record<string, string> = {
  lead: "bg-emerald-400",
  access_request: "bg-amber-400",
  ai_job: "bg-accent-purple",
  delivery_failed: "bg-red-500",
}

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function NotificationBell({ prefixPath }: { prefixPath: (href: string) => string }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AdminNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [unavailable, setUnavailable] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      setItems(data.notifications || [])
      setUnread(data.unread || 0)
      setUnavailable(Boolean(data.unavailable))
    } catch {
      // keep the last known state
    }
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load()
    }, 60_000)
    return () => clearInterval(timer)
  }, [load])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
    setUnread(0)
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-admin-line bg-admin-panel text-slate-300 transition hover:text-white hover:border-brand/50"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[80] mt-2 w-[360px] overflow-hidden rounded-2xl border border-admin-line bg-admin-bg-deep shadow-2xl">
          <div className="flex items-center justify-between border-b border-admin-line px-4 py-3">
            <p className="text-[13px] font-bold text-white">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:text-white">
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {unavailable && (
              <p className="px-4 py-6 text-center text-[12.5px] text-slate-400">
                Notifications start working after the 2026-11-08 database migration.
              </p>
            )}
            {!unavailable && items.length === 0 && (
              <p className="px-4 py-6 text-center text-[12.5px] text-slate-400">You are all caught up.</p>
            )}
            {items.map((n) => (
              <Link
                key={n.id}
                href={n.link ? prefixPath(n.link) : prefixPath("/admin")}
                onClick={() => setOpen(false)}
                className={`flex gap-3 border-b border-admin-line/60 px-4 py-3 transition hover:bg-admin-panel ${n.read_at ? "opacity-70" : ""}`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[n.type] || "bg-slate-400"}`} />
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-white">{n.title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-slate-400">{n.body}</span>
                  <span className="mt-1 block text-[10.5px] text-slate-500">{timeAgo(n.created_at)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
