"use client"

import { useEffect, useMemo, useState } from "react"
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
  Sun,
  SunMedium,
} from "lucide-react"
import { APP_ROLES, AppRole, isPathAllowed, rolesConfig } from "@lib/config/roles"
import NotificationBell from "./_components/NotificationBell"
import { ToastProvider } from "@/components/ui/Toast"

type NavItem = { label: string; href: string; icon: React.ReactNode; exact?: boolean }

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={17} />, exact: true }] },
  {
    title: "Content",
    items: [
      { label: "Pages & SEO", href: "/admin/pages", icon: <Globe size={17} /> },
      { label: "Blog", href: "/admin/blog", icon: <FileText size={17} /> },
      { label: "Services", href: "/admin/services", icon: <Briefcase size={17} /> },
      { label: "Case Studies", href: "/admin/case-studies", icon: <BookOpen size={17} /> },
      { label: "Products", href: "/admin/products", icon: <Package size={17} /> },
    ],
  },
  {
    title: "SEO",
    items: [
      { label: "SEO Report", href: "/admin/seo/report", icon: <BarChart3 size={17} /> },
      { label: "Sitemap", href: "/admin/sitemap", icon: <Map size={17} /> },
    ],
  },
  { title: "Growth", items: [{ label: "Leads", href: "/admin/leads", icon: <Inbox size={17} /> }] },
  {
    title: "Administration",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: <Users size={17} /> },
      { label: "Clients", href: "/admin/clients", icon: <Building2 size={17} /> },
      { label: "Audit Log", href: "/admin/audit", icon: <History size={17} /> },
      { label: "Security (2FA)", href: "/admin/security", icon: <ShieldCheck size={17} /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings size={17} /> },
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
        setFullName(data.full_name || (data.email ? data.email.split("@")[0] : "Admin User"))
        if (data.customAdminPath) setAdminPath(data.customAdminPath)
      })
      .catch(() => router.replace("/admin-login?error=Session+check+failed"))
  }, [router])

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

  function toggle() {
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

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-[13.5px] font-medium text-slate-300">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          Verifying administrative credentials…
        </div>
      </div>
    )
  }

  const width = collapsed ? "w-[76px]" : "w-[248px]"

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex fixed left-0 top-0 z-50 h-full flex-col border-r border-slate-800 bg-slate-900 py-4 transition-all duration-300 ${width} ${
            collapsed ? "px-3" : "px-4"
          }`}
        >
          <button
            type="button"
            onClick={toggle}
            className="absolute -right-3 top-7 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md transition hover:border-emerald-500 hover:bg-emerald-600 hover:text-white cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          {/* Brand header */}
          <div className={`mb-6 flex items-center gap-3 ${collapsed ? "justify-center" : "px-1"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/30">
              <SunMedium className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <p className="text-[14px] font-extrabold text-white">AG POWER</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Admin Portal</p>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-5 overflow-y-auto pr-1 pb-10 scrollbar-thin scrollbar-thumb-slate-700 [scrollbar-width:thin]">
            {groups.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                        title={collapsed ? item.label : undefined}
                        className={`group relative flex items-center gap-3 rounded-xl text-[13px] font-semibold transition ${
                          collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2.5"
                        } ${
                          active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500" />}
                        <span className={active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}>
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
          <div className="space-y-1 border-t border-slate-800 pt-3">
            <Link
              href="/"
              target="_blank"
              className={`flex items-center gap-3 rounded-xl text-[12.5px] font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2"
              }`}
              title="View live website"
            >
              <ExternalLink size={15} />
              {!collapsed && <span>Live Website</span>}
            </Link>
            <button
              type="button"
              onClick={logout}
              className={`flex w-full items-center gap-3 rounded-xl text-[12.5px] font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer ${
                collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2"
              }`}
              title="Sign out"
            >
              <LogOut size={15} />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
            <div className="relative flex w-72 flex-col bg-slate-900 border-r border-slate-800 p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <SunMedium className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white">AG POWER</p>
                    <p className="text-[10px] font-bold uppercase text-emerald-400">Admin Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto py-4 pb-12 scrollbar-thin scrollbar-thumb-slate-700 [scrollbar-width:thin]">
                {groups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                              active
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
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

              <div className="border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer"
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
            collapsed ? "lg:ml-[76px]" : "lg:ml-[248px]"
          }`}
        >
          {/* Sticky Header: Solid opaque background (never transparent blur) to prevent ghost text overlap */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 sm:px-8 shadow-sm">
            {/* Mobile menu trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                aria-label="Open navigation drawer"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-[14px] font-bold text-white">AG POWER Admin</span>
            </div>

            <div className="hidden lg:block text-[13px] text-slate-400 font-medium">
              Enterprise Solar EPC & Content Control
            </div>

            {/* Top Bar User Profile & Notifications */}
            <div className="flex items-center gap-3">
              <NotificationBell prefixPath={prefixPath} />
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-[12px] font-bold uppercase text-emerald-400">
                  {(email || "A").charAt(0).toUpperCase()}
                </div>
                <div className="hidden leading-tight sm:block text-left">
                  <p className="max-w-[180px] truncate text-[12px] font-bold text-white">{fullName || email}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {ROLE_LABEL[role] || role}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Page Viewport */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
