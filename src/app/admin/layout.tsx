"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  History,
  Inbox,
  LayoutDashboard,
  LogOut,
  Map,
  Package,
  Settings,
  ShieldCheck,
  Users,
  Menu,
  X,
  SunMedium,
  Search,
  UserCheck,
  ChevronDown,
} from "lucide-react"
import { APP_ROLES, AppRole, isPathAllowed, rolesConfig } from "@lib/config/roles"
import NotificationBell from "./_components/NotificationBell"
import AdminCommandPalette from "./_components/AdminCommandPalette"
import AdminThemeToggle from "./_components/AdminThemeToggle"
import { ToastProvider } from "@/components/ui/Toast"

type NavItem = { label: string; href: string; icon: React.ReactNode; exact?: boolean }

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} />, exact: true },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blogs", href: "/admin/blog", icon: <FileText size={16} /> },
      { label: "Services", href: "/admin/services", icon: <Briefcase size={16} /> },
      { label: "Case Studies", href: "/admin/case-studies", icon: <BookOpen size={16} /> },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Leads", href: "/admin/leads", icon: <Inbox size={16} /> },
      { label: "Products", href: "/admin/products", icon: <Package size={16} /> },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "SEO Hub", href: "/admin/seo", icon: <Globe size={16} /> },
      { label: "Analytics & Report", href: "/admin/seo/report", icon: <BarChart3 size={16} /> },
      { label: "Sitemap", href: "/admin/sitemap", icon: <Map size={16} /> },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", href: "/admin/settings", icon: <Settings size={16} /> },
      { label: "Security & 2FA", href: "/admin/security", icon: <ShieldCheck size={16} /> },
      { label: "Users & Roles", href: "/admin/users", icon: <Users size={16} /> },
      { label: "Audit Log", href: "/admin/audit", icon: <History size={16} /> },
    ],
  },
]

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  editor: "Editor",
  admin: "Admin",
  marketer: "Editor",
  customer: "Customer",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AppRole | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [adminPath, setAdminPath] = useState("admin")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("admin_sidebar_collapsed") === "true")
    } catch {
      // storage unavailable
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const root = window.location.pathname.split("/").filter(Boolean)[0] || "admin"
          router.replace(root === "admin" ? "/admin-login" : `/${root}-login`)
          return
        }
        const data = await res.json()
        setRole(APP_ROLES.includes(data.role) ? data.role : "editor")
        setEmail(data.email || null)
        setFullName(data.full_name || "Akash Shukla")
        if (data.customAdminPath) setAdminPath(data.customAdminPath)
      })
      .catch(() => router.replace("/admin-login?error=Session+check+failed"))
  }, [router])

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileDrawerOpen(false)
  }, [pathname])

  const prefixPath = (href: string) => (adminPath === "admin" ? href : href.replace(/^\/admin/, `/${adminPath}`))
  const isActive = (item: NavItem) => {
    const target = prefixPath(item.href)
    return item.exact ? pathname === target : pathname === target || pathname.startsWith(`${target}/`)
  }

  const groups = useMemo(() => {
    if (!role) return []
    const allowed = rolesConfig[role]?.allowedFrontendPaths || ["*"]
    return NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => isPathAllowed(i.href, allowed)) })).filter(
      (g) => g.items.length
    )
  }, [role])

  function toggleSidebar() {
    setCollapsed((prev) => {
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(!prev))
      } catch {
        // ignore
      }
      return !prev
    })
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace(adminPath === "admin" ? "/admin-login" : `/${adminPath}-login`)
  }

  // Extract clean first name ("Akash")
  const firstName = useMemo(() => {
    if (!fullName) return "Akash"
    const cleaned = fullName.trim().split(" ")[0]
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }, [fullName])

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
        <div className="flex items-center gap-3 text-[13px] font-medium text-slate-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span>Verifying administrative session…</span>
        </div>
      </div>
    )
  }

  const width = collapsed ? "w-[72px]" : "w-[240px]"

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex fixed left-0 top-0 z-50 h-full flex-col border-r border-white/[0.08] bg-slate-900/95 backdrop-blur-md py-4 transition-all duration-300 ${width} ${
            collapsed ? "px-2.5" : "px-3.5"
          }`}
        >
          {/* Collapse Toggle Chevron */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-slate-300 shadow-md transition hover:border-emerald-500 hover:bg-emerald-600 hover:text-white cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          {/* Brand header: Logo + "AG POWER" only */}
          <div className={`mb-6 flex items-center gap-2.5 ${collapsed ? "justify-center" : "px-2"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-950/40">
              <SunMedium className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-sans text-[16px] font-extrabold tracking-tight text-white">AG POWER</span>
              </div>
            )}
          </div>

          {/* Grouped Nav Items */}
          <nav className="flex-1 space-y-4 overflow-y-auto pr-1 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {groups.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {group.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item)
                    return (
                      <Link
                        key={item.href}
                        href={prefixPath(item.href)}
                        title={collapsed ? `${group.title}: ${item.label}` : undefined}
                        className={`group relative flex items-center gap-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                          collapsed ? "mx-auto h-9 w-9 justify-center" : "px-2.5 py-2"
                        } ${
                          active
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-xs"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500" />
                        )}
                        <span className={active ? "text-emerald-400" : "text-slate-400 group-hover:text-white"}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer actions */}
          <div className="space-y-1 border-t border-white/[0.08] pt-3">
            <Link
              href="/"
              target="_blank"
              className={`flex items-center gap-2.5 rounded-xl text-[12.5px] font-medium text-slate-400 transition hover:bg-slate-800/60 hover:text-white ${
                collapsed ? "mx-auto h-9 w-9 justify-center" : "px-2.5 py-1.5"
              }`}
              title="View live website"
            >
              <ExternalLink size={15} />
              {!collapsed && <span>Live Website ↗</span>}
            </Link>
            <button
              type="button"
              onClick={logout}
              className={`flex w-full items-center gap-2.5 rounded-xl text-[12.5px] font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer ${
                collapsed ? "mx-auto h-9 w-9 justify-center" : "px-2.5 py-1.5"
              }`}
              title="Sign out"
            >
              <LogOut size={15} />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
            <div className="relative flex w-68 flex-col bg-slate-900 border-r border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <SunMedium className="h-4 w-4" />
                  </div>
                  <span className="font-sans text-[16px] font-extrabold text-white">AG POWER</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto py-2 pb-8 [scrollbar-width:none]">
                {groups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const active = isActive(item)
                        return (
                          <Link
                            key={item.href}
                            href={prefixPath(item.href)}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition ${
                              active
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <span className={active ? "text-emerald-400" : "text-slate-400"}>{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="border-t border-white/[0.08] pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12.5px] font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
            collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
          }`}
        >
          {/* Header Bar */}
          <header className="sticky top-0 z-40 flex h-15 items-center justify-between border-b border-white/[0.08] bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 shadow-xs">
            {/* Left: Mobile menu trigger + Logo on mobile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 lg:hidden cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <SunMedium className="h-4 w-4" />
                </div>
                <span className="font-sans text-[15px] font-extrabold text-white">AG POWER</span>
              </div>

              {/* Global Search Bar (opens Ctrl+K command palette) */}
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[12px] text-slate-400 hover:border-emerald-500/50 hover:text-slate-200 transition-all cursor-pointer shadow-xs w-60 md:w-72"
              >
                <Search className="h-3.5 w-3.5 text-slate-500" />
                <span className="flex-1 text-left truncate">Search or type a command...</span>
                <kbd className="rounded border border-white/10 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Right: Search mobile icon, Theme toggle, Notification bell, Profile menu */}
            <div className="flex items-center gap-2.5">
              {/* Mobile search trigger */}
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-300"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Light / Dark Theme Toggle */}
              <AdminThemeToggle />

              {/* Notification Bell */}
              <NotificationBell prefixPath={prefixPath} />

              {/* Profile Menu: Avatar + First Name ("Akash") + Role Badge with Dropdown */}
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-1.5 sm:px-2.5 sm:py-1.5 transition-all hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer shadow-xs"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-[12px] font-bold text-emerald-400 border border-emerald-500/30">
                    {firstName.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[12.5px] font-bold text-white">{firstName}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                      {ROLE_LABEL[role] || role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:block ml-0.5" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-[13px] font-bold text-white">{fullName || firstName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{email}</p>
                      <span className="mt-1.5 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                        {ROLE_LABEL[role] || role}
                      </span>
                    </div>

                    <Link
                      href={prefixPath("/admin/settings")}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Company Settings</span>
                    </Link>

                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <ExternalLink className="h-4 w-4 text-emerald-400" />
                      <span>View Live Site</span>
                    </Link>

                    <div className="border-t border-white/[0.08] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Global Command Palette Modal */}
        <AdminCommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          prefixPath={prefixPath}
        />
      </div>
    </ToastProvider>
  )
}
