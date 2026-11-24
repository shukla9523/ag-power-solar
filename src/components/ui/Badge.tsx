import React from "react"

export interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "danger" | "info" | "neutral"
  size?: "sm" | "md"
  className?: string
}

export function Badge({ children, variant = "neutral", size = "sm", className = "" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
    info: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-[12px]",
  }

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
