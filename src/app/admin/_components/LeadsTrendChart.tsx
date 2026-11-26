"use client"

import React, { useState, useMemo } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { TrendingUp, Calendar, Inbox } from "lucide-react"

interface TrendItem {
  date: string
  displayDate: string
  leads: number
  count: number
}

interface LeadsTrendChartProps {
  data: TrendItem[]
}

export default function LeadsTrendChart({ data = [] }: LeadsTrendChartProps) {
  const [range, setRange] = useState<"7D" | "14D" | "30D">("30D")

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []
    const sliceCount = range === "7D" ? 7 : range === "14D" ? 14 : 30
    return data.slice(-sliceCount)
  }, [data, range])

  const totalInPeriod = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.count || curr.leads || 0), 0)
  }, [filteredData])

  const hasLeads = data.some((d) => (d.count || d.leads) > 0)

  return (
    <div className="w-full">
      {/* Header with Range Selector & Metric pill */}
      <div className="flex flex-wrap items-center justify-between pb-4 gap-3 border-b border-white/[0.08] mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[18px] font-extrabold text-white">Leads Over Time</span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/25">
                {totalInPeriod} enquiries
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Customer quote & rooftop assessment velocity</p>
          </div>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center rounded-xl border border-white/[0.08] bg-slate-950/60 p-1">
          {(["7D", "14D", "30D"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                range === r
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {!hasLeads ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
          <div className="rounded-2xl bg-slate-800/80 p-3 text-slate-400 border border-white/10">
            <Inbox className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mt-3 text-[13px] font-semibold text-white">No lead activity in the selected range</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Inbound customer quote requests will appear in this interactive area graph.
          </p>
        </div>
      ) : (
        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                interval={range === "7D" ? 0 : range === "14D" ? 2 : 4}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as TrendItem
                    const count = item.count || item.leads || 0
                    return (
                      <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="h-3 w-3 text-emerald-400" />
                          <span>{item.date}</span>
                        </div>
                        <p className="mt-1 font-sans text-[15px] font-extrabold text-white">
                          {count} <span className="text-emerald-400 font-bold text-[12px]">{count === 1 ? "Lead" : "Leads"}</span>
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
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#leadAreaGradient)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
