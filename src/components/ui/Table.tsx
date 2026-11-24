import React from "react"

export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-md ${className}`}>
      <table className="w-full border-collapse text-left text-[13px] text-slate-200">
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <thead>
      <tr className={`border-b border-slate-800 bg-slate-900/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${className}`}>
        {children}
      </tr>
    </thead>
  )
}

export function TableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-slate-800/80 ${className}`}>{children}</tbody>
}

export function TableRow({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-slate-800/40 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  )
}

export function TableHeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`p-4 font-bold ${className}`}>{children}</th>
}

export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-4 align-middle ${className}`}>{children}</td>
}
