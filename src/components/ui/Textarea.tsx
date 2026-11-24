import React from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/40" : ""
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[11.5px] font-medium text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-[11.5px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
