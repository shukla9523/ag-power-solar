"use client"

/**
 * Purpose: admin shell — grouped sidebar (Overview, Content, SEO, Growth, Administration),
 * top bar with notification bell and signed-in user, and a session guard.
 *
 * Navigation is filtered by the role returned from /api/auth/me (never from localStorage);
 * this only hides links — every admin API enforces permissions on the server.
 */

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
} from "lucide-react"
import { APP_ROLES, AppRole, isPathAllowed, rolesConfig } from "@lib/config/roles"
import NotificationBell from "./_components/NotificationBell"

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

const ROLE_LABEL: Record<string, string> = { owner: "Owner", admin: "Admin", marketer: "Marketer", customer: "Customer" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AppRole | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [adminPath, setAdminPath] = useState("admin")
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("admin_sidebar_collapsed") === "true")
      localStorage.removeItem("admin_role")
      localStorage.removeItem("admin_email")
    } catch {
      // storage unavailable: keep defaults
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const root = window.location.pathname.split("/").filter(Boolean)[0] || "admin"
          router.replace(root === "admin" ? "/admin-login" : `/${root}-login`)
          return
        }
        const data = await res.json()
        setRole(APP_ROLES.includes(data.role) ? data.role : "customer")
        setEmail(data.email || null)
        if (data.customAdminPath) setAdminPath(data.customAdminPath)
      })
      .catch(() => router.replace("/admin-login?error=Session+check+failed"))
  }, [router])

  const prefixPath = (href: string) => (adminPath === "admin" ? href : href.replace(/^\/admin/, `/${adminPath}`))
  const isActive = (item: NavItem) => {
    const target = prefixPath(item.href)
    return item.exact ? pathname === target : pathname === target || pathname.startsWith(`${target}/`)
  }

  const groups = useMemo(() => {
    if (!role) return []
    const allowed = rolesConfig[role].allowedFrontendPaths
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
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="flex items-center gap-3 text-[13px] text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          Checking your session…
        </div>
      </div>
    )
  }

  const width = collapsed ? "w-[76px]" : "w-[248px]"

  return (
    <div className="flex min-h-screen bg-admin-bg text-line-cool">
      <aside className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-admin-panel-2 bg-admin-bg-deep py-4 transition-all duration-300 ${width} ${collapsed ? "px-3" : "px-4"}`}>
        <button
          type="button"
          onClick={toggle}
          className="absolute -right-3 top-7 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-admin-line bg-admin-panel text-slate-300 shadow-md transition hover:border-brand hover:bg-brand hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        <div className={`mb-6 flex items-center gap-3 ${collapsed ? "justify-center" : "px-1"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-md shadow-brand/25">
            <span className="text-[15px] font-black text-white">M</span>
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-[14px] font-bold text-white">AG POWER</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Admin</p>
            </div>
          )}
        </div>

        <nav className="no-scrollbar flex-1 space-y-5 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{group.title}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item)
                  return (
                    <Link
                      key={item.href}
                      href={prefixPath(item.href)}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition ${collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2.5"} ${
                        active ? "bg-brand/15 text-white" : "text-slate-400 hover:bg-admin-panel hover:text-slate-100"
                      }`}
                    >
                      {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand" />}
                      <span className={active ? "text-brand" : ""}>{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-admin-panel-2 pt-3">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 rounded-xl text-[12.5px] text-slate-400 transition hover:bg-admin-panel hover:text-white ${collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2"}`}
            title="View website"
          >
            <ExternalLink size={15} />
            {!collapsed && <span>View website</span>}
          </Link>
          <button
            type="button"
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl text-[12.5px] text-slate-400 transition hover:bg-admin-panel hover:text-editz-alert ${collapsed ? "mx-auto h-10 w-10 justify-center" : "px-3 py-2"}`}
            title="Sign out"
          >
            <LogOut size={15} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${collapsed ? "ml-[76px]" : "ml-[248px]"}`}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-3 border-b border-admin-panel-2 bg-admin-bg/90 px-8 backdrop-blur">
          <NotificationBell prefixPath={prefixPath} />
          <div className="flex items-center gap-3 rounded-xl border border-admin-line bg-admin-panel px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 text-[12px] font-bold uppercase text-brand">
              {(email || "?").charAt(0)}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="max-w-[180px] truncate text-[12px] font-semibold text-white">{email}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand">{ROLE_LABEL[role] || role}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-8 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
