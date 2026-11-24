import React from "react"
import { Button } from "./Button"

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
      {icon && <div className="mb-3 rounded-full bg-slate-800 p-3 text-slate-300">{icon}</div>}
      <h3 className="text-[15px] font-bold text-white">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-[12.5px] text-slate-400">{description}</p>}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
