"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Inbox,
  Package,
  Briefcase,
  FileText,
  BookOpen,
  BarChart3,
  Map,
  Settings,
  ShieldCheck,
  Users,
  ExternalLink,
  Plus,
  ArrowRight,
  X,
} from "lucide-react"

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  href: string
  icon: React.ReactNode
  category: "Navigation" | "Quick Actions" | "External"
}

interface AdminCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  prefixPath: (href: string) => string
}

export default function AdminCommandPalette({
  isOpen,
  onClose,
  prefixPath,
}: AdminCommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items: CommandItem[] = [
    // Quick Actions
    {
      id: "new-blog",
      title: "Create New Blog Post",
      subtitle: "Write and publish solar guides",
      href: "/admin/blog/new",
      icon: <Plus className="h-4 w-4 text-emerald-400" />,
      category: "Quick Actions",
    },
    {
      id: "new-service",
      title: "Add New Service Offering",
      subtitle: "Residential, commercial or society EPC",
      href: "/admin/services/new",
      icon: <Plus className="h-4 w-4 text-sky-400" />,
      category: "Quick Actions",
    },
    {
      id: "new-case-study",
      title: "Add New Case Study",
      subtitle: "Turnkey customer solar project",
      href: "/admin/case-studies/new",
      icon: <Plus className="h-4 w-4 text-purple-400" />,
      category: "Quick Actions",
    },
    // Navigation
    {
      id: "dashboard",
      title: "Dashboard Overview",
      subtitle: "Leads KPIs, analytics & activity",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4 text-emerald-400" />,
      category: "Navigation",
    },
    {
      id: "leads",
      title: "Customer Leads & Enquiries",
      subtitle: "View, filter and manage quote requests",
      href: "/admin/leads",
      icon: <Inbox className="h-4 w-4 text-amber-400" />,
      category: "Navigation",
    },
    {
      id: "products",
      title: "Solar Panels & Hardware Catalogue",
      subtitle: "Manage modules, datasheets and specs",
      href: "/admin/products",
      icon: <Package className="h-4 w-4 text-sky-400" />,
      category: "Navigation",
    },
    {
      id: "services",
      title: "Services Management",
      subtitle: "Residential, commercial & housing society",
      href: "/admin/services",
      icon: <Briefcase className="h-4 w-4 text-emerald-400" />,
      category: "Navigation",
    },
    {
      id: "blog",
      title: "Blog Articles & Guides",
      subtitle: "Manage content, SEO and drafts",
      href: "/admin/blog",
      icon: <FileText className="h-4 w-4 text-slate-300" />,
      category: "Navigation",
    },
    {
      id: "case-studies",
      title: "Case Studies & Installations",
      subtitle: "Verified on-site customer projects",
      href: "/admin/case-studies",
      icon: <BookOpen className="h-4 w-4 text-purple-400" />,
      category: "Navigation",
    },
    {
      id: "seo-report",
      title: "SEO Health & Audit Report",
      subtitle: "Meta tags, schema graph & performance",
      href: "/admin/seo/report",
      icon: <BarChart3 className="h-4 w-4 text-amber-400" />,
      category: "Navigation",
    },
    {
      id: "sitemap",
      title: "Sitemap & Search Visibility",
      subtitle: "Inspect indexed routes and priority",
      href: "/admin/sitemap",
      icon: <Map className="h-4 w-4 text-emerald-400" />,
      category: "Navigation",
    },
    {
      id: "settings",
      title: "Global Site Settings",
      subtitle: "Company profile, phone and contact details",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4 text-slate-400" />,
      category: "Navigation",
    },
    {
      id: "security",
      title: "Security & 2FA Settings",
      subtitle: "Two-factor authentication and session logs",
      href: "/admin/security",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
      category: "Navigation",
    },
    {
      id: "users",
      title: "Users & Team Roles",
      subtitle: "Manage admin permissions and access",
      href: "/admin/users",
      icon: <Users className="h-4 w-4 text-sky-400" />,
      category: "Navigation",
    },
    // External
    {
      id: "live-site",
      title: "Open Live Website",
      subtitle: "agpower.in public homepage",
      href: "/",
      icon: <ExternalLink className="h-4 w-4 text-emerald-400" />,
      category: "External",
    },
  ]

  const filtered = items.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onClose()
      setQuery("")
      if (item.category === "External") {
        window.open(item.href, "_blank")
      } else {
        router.push(prefixPath(item.href))
      }
    },
    [onClose, prefixPath, router]
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filtered, selectedIndex, handleSelect, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-emerald-950/20 antialiased animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/[0.08] px-4 py-3.5">
          <Search className="h-5 w-5 text-emerald-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions, leads or tools... (Esc to close)"
            autoFocus
            className="w-full bg-transparent text-[13px] text-white placeholder-slate-400 outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded-md border border-white/10 bg-slate-800/60 px-2 py-0.5 text-[11px] font-mono text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 [scrollbar-width:thin]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-[13px] font-medium text-slate-300">No matching command found</p>
              <p className="text-[11px] text-slate-500 mt-1">Try searching for &quot;leads&quot;, &quot;blog&quot;, or &quot;service&quot;</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/15 text-white border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        isSelected
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                          : "border-white/10 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold truncate text-white">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected ? "text-emerald-400 translate-x-0.5" : "text-slate-600"
                      }`}
                    />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-slate-950/40 px-4 py-2.5 text-[11px] text-slate-400">
          <span>Navigate with <kbd className="font-mono text-slate-300">↑</kbd> <kbd className="font-mono text-slate-300">↓</kbd></span>
          <span>Select with <kbd className="font-mono text-slate-300">↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  )
}
