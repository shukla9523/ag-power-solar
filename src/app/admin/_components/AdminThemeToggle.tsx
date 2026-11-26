"use client"

import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_theme") as "dark" | "light" | null
      if (saved === "light" || saved === "dark") {
        setTheme(saved)
        document.documentElement.setAttribute("data-admin-theme", saved)
      } else {
        document.documentElement.setAttribute("data-admin-theme", "dark")
      }
    } catch {
      // ignore
    }
  }, [])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    try {
      localStorage.setItem("admin_theme", next)
      document.documentElement.setAttribute("data-admin-theme", next)
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 transition-all hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white cursor-pointer shadow-xs"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-label="Toggle admin color theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-sky-400" />
      )}
    </button>
  )
}
