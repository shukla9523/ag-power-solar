import React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]"

  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm",
    outline: "border border-slate-600 hover:border-slate-500 bg-transparent text-slate-200 hover:text-white",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-[12px] gap-1.5 min-h-[34px]",
    md: "px-4 py-2.5 text-[13.5px] gap-2 min-h-[42px]",
    lg: "px-5 py-3 text-[15px] gap-2.5 min-h-[48px]",
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  )
}
