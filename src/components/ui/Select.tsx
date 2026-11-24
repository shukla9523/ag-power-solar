import React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: { value: string; label: string }[]
}

export function Select({
  label,
  error,
  options,
  children,
  className = "",
  id,
  ...props
}: SelectProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-[13px] text-white outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 cursor-pointer ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-[11.5px] font-medium text-red-400">{error}</p>}
    </div>
  )
}
