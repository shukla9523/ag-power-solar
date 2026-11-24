"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SOLAR_PANELS } from "@data/panels"
import { ArrowRight, CheckCircle2, Award, Sparkles, Zap } from "lucide-react"

export default function FeaturedSolarPanels() {
  const router = useRouter()

  return (
    <section className="bg-white py-[72px]" id="solar-panels">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Tier-1 Modules</span>
            </div>
            <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
              High-Efficiency <span className="text-emerald-600">Tier-1 Solar Panels</span>
            </h2>
            <p className="mt-3 max-w-[680px] text-[17px] text-slate-600 leading-relaxed">
              Real high-efficiency photovoltaic modules engineered for maximum generation, harsh Indian weather durability, and guaranteed 25–30 year customer returns.
            </p>
          </div>

          <LocalizedClientLink
            href="/solar-panels"
            className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-300 px-5 font-inter text-[14px] font-bold text-forest-deep transition-all shadow-sm active:scale-95 text-center"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="h-4 w-4 text-emerald-700" />
          </LocalizedClientLink>
        </div>

        {/* 3 Featured Panel Cards with Real Photos & Customer Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SOLAR_PANELS.map((panel, idx) => (
            <div
              key={panel.slug}
              onClick={() => router.push(`/solar-panels/${panel.slug}`)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] hover:-translate-y-1 cursor-pointer"
            >
              {/* 3px Yellow Top Border on Card Hover */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl z-20 pointer-events-none" />

              <div>
                {/* ── Real Solar Panel Photo with Customer Benefits Overlay (Clickable to Details Page) ── */}
                <div
                  className="relative block h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  aria-label={`View detailed specifications for ${panel.brand} ${panel.name}`}
                >
                  <Image
                    src={panel.images[0]?.src || "/panels/n-type-topcon-bifacial/main.webp"}
                    alt={panel.images[0]?.alt || `${panel.brand} ${panel.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx === 0}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Directional Scrim for Maximum Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 via-50% to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                    {panel.badge ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-md shadow-md border border-white/20">
                        <span>{panel.badge}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-md border border-white/15">
                        {panel.brand}
                      </span>
                    )}

                    <span className="rounded-full bg-slate-950/85 px-3 py-1 font-manrope text-[13px] font-black text-amber-400 backdrop-blur-md shadow-md border border-white/20">
                      {panel.wattageRange}
                    </span>
                  </div>

                  {/* Bottom Overlaid Customer Benefit Bar */}
                  <div className="absolute bottom-3.5 inset-x-3.5 z-10">
                    <div className="rounded-xl border border-white/25 bg-slate-950/80 p-3 text-white backdrop-blur-md shadow-xl">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 flex-shrink-0">
                          <Zap className="h-3 w-3 fill-current" />
                        </span>
                        <p className="font-manrope text-[13.5px] font-extrabold text-amber-300">
                          {panel.customerBenefit.tag}
                        </p>
                      </div>
                      <p className="mt-1 text-[11.5px] font-medium text-slate-200 line-clamp-1">
                        {panel.customerBenefit.highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Card Content: 28px Padding, 24px Titles, 16px Body ── */}
                <div className="p-[28px]">
                  {/* Brand & Model */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold uppercase tracking-wider text-emerald-700">
                      {panel.brand}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      <Award className="h-3 w-3 text-emerald-600" />
                      Tier-1 ALMM
                    </span>
                  </div>

                  <h3 className="mt-2 font-manrope text-[24px] font-extrabold leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {panel.name}
                  </h3>

                  <p className="mt-1 text-[13.5px] font-semibold text-slate-500">
                    {panel.technology}
                  </p>

                  {/* Customer Benefits Checklist */}
                  <div className="mt-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4">
                    <p className="text-[12px] font-extrabold uppercase tracking-wider text-emerald-900">
                      Direct Customer Benefits:
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {panel.customerBenefit.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-[16px] text-slate-700 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specifications Grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-[13px]">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <span className="text-slate-500 block text-[11px]">Efficiency</span>
                      <strong className="font-manrope font-extrabold text-slate-900 text-[14px]">
                        {panel.efficiency}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <span className="text-slate-500 block text-[11px]">Warranty</span>
                      <strong className="font-manrope font-extrabold text-slate-900 text-[13px]">
                        {panel.warranty.performance.split(" ")[0]} Linear Power
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 col-span-2">
                      <span className="text-slate-500 block text-[11px]">Best Suited For</span>
                      <span className="font-medium text-slate-800 text-[12px]">
                        {panel.bestFor.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: "View Details" + "Enquire For This Panel" */}
              <div className="p-[28px] pt-0 flex flex-col gap-2.5">
                <LocalizedClientLink
                  href={`/solar-panels/${panel.slug}`}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-4 font-inter text-[13.5px] font-bold text-slate-800 hover:text-emerald-800 transition-all active:scale-95 text-center"
                >
                  <span>View Details & Specifications</span>
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </LocalizedClientLink>

                <LocalizedClientLink
                  href={`/contact?panel=${panel.slug}`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 font-inter text-[14px] font-extrabold text-white shadow-md transition-all active:scale-95"
                >
                  <span>Enquire For This Panel</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </LocalizedClientLink>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
