"use client"

import React from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface TrendItem {
  date: string
  displayDate: string
  leads: number
  count: number
}

interface LeadsTrendChartProps {
  data: TrendItem[]
}

export default function LeadsTrendChart({ data }: LeadsTrendChartProps) {
  const hasLeads = data.some((d) => d.count > 0)

  if (!hasLeads) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/50 p-6 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="mt-3 text-[14px] font-semibold text-white">No lead activity in the last 30 days</p>
        <p className="mt-1 text-[12px] text-slate-400">Inbound customer quote requests will appear here dynamically.</p>
      </div>
    )
  }

  return (
    <div className="h-56 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#475569" }}
            interval={4}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as TrendItem
                return (
                  <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
                    <p className="text-[11px] font-medium text-slate-400">Date: {item.date}</p>
                    <p className="text-[13px] font-bold text-emerald-400">
                      {item.count} {item.count === 1 ? "Lead" : "Leads"}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#16A34A"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#leadGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
