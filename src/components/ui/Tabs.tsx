"use client"

import React from "react"

export interface TabItem {
  id: string
  label: string
  badge?: string | number
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex border-b border-slate-800 bg-slate-900/60 px-4 text-[13px] font-bold overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
