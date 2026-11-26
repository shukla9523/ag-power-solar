"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShieldCheck, Zap, CheckCircle2, ArrowRight } from "lucide-react"
import type { Service } from "@lib/data/services"

interface ServiceHeroProps {
  service: Service
  slug: string
}

export default function ServiceHero({ service, slug }: ServiceHeroProps) {
  const isResidential = slug.includes("residential")
  const isCommercial = slug.includes("commercial")
  const isSociety = slug.includes("society")

  // Button labels and destinations tailored per page
  const primaryBtn = isResidential
    ? { label: "Calculate My Savings", href: "/calculator?cat=residential" }
    : isCommercial
    ? { label: "Get Free Proposal", href: "/contact?cat=commercial" }
    : { label: "Free Society Consultation", href: "/contact?cat=society" }

  const secondaryBtn = isResidential
    ? { label: "Get Free Consultation", href: "/contact?service=residential-solar" }
    : isCommercial
    ? { label: "Calculate ROI", href: "/calculator?cat=commercial" }
    : { label: "Calculate Savings", href: "/calculator?cat=society" }

  return (
    <section className="relative overflow-hidden bg-forest py-14 text-white sm:py-18 lg:py-22">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-forest-deep/50 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">

          {/* Left Column: Heading, Intro, Badges & CTAs */}
          <div className="lg:col-span-7">
            {/* Reduced H1 size via clamp(2rem, 4vw, 3.5rem) */}
            <h1 className="font-manrope text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.14] tracking-tight text-white">
              {service.title}
            </h1>

            {/* High contrast intro copy */}
            <p className="mt-5 text-[16px] sm:text-[18px] leading-relaxed text-white/90 font-normal max-w-2xl">
              {service.intro || service.description}
            </p>

            {/* 3 High-contrast Badges (Icons Yellow, Text text-muted / cream, min 14px) */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-2 text-[14px] font-medium text-white/95">
                <ShieldCheck className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>25-Year Performance Warranty</span>
              </span>

              <span className="flex items-center gap-2 text-[14px] font-medium text-white/95">
                <Zap className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>Bifacial &amp; TOPCon Modules</span>
              </span>

              <span className="flex items-center gap-2 text-[14px] font-medium text-white/95">
                <CheckCircle2 className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>Complete DISCOM Liaison</span>
              </span>
            </div>

            {/* Reusable Buttons: Stacked on mobile (<640px) with 12px gap, inline on desktop */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <LocalizedClientLink
                href={primaryBtn.href}
                className="btn-primary w-full sm:w-auto"
              >
                <span>{primaryBtn.label}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href={secondaryBtn.href}
                className="btn-secondary w-full sm:w-auto"
              >
                <span>{secondaryBtn.label}</span>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right Column: High-Contrast Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/15 bg-black/25 p-6 sm:p-7 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-manrope text-[20px] font-bold text-white tracking-tight">
                  {service.shortLabel} Snapshot
                </h3>
                <span className="rounded-full bg-gold/20 border border-gold/30 px-2.5 py-0.5 text-[11px] font-bold text-cream">
                  VERIFIED EPC
                </span>
              </div>

              {/* Subtitle changed to high-contrast cream */}
              <p className="mt-2 text-[14px] font-semibold text-cream leading-snug">
                Engineered for continuous reliability and maximum ROI
              </p>

              {/* Unique Metric Cards Per Service */}
              <div className="mt-5 space-y-3.5">
                
                {/* ── RESIDENTIAL UNIQUE SNAPSHOT ── */}
                {isResidential && (
                  <>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Government Subsidy
                      </p>
                      <p className="font-manrope text-[26px] font-black text-gold leading-tight mt-0.5">
                        Up to ₹78,000
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Direct Benefit Transfer (DBT) under PM Surya Ghar
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Bill Offset
                      </p>
                      <p className="font-manrope text-[26px] font-black text-white leading-tight mt-0.5">
                        Up to 90%
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Direct reduction in recurring monthly grid power bills
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Capital Payback
                      </p>
                      <p className="font-manrope text-[26px] font-black text-white leading-tight mt-0.5">
                        2.5 - 4 Years
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Guaranteed free solar energy for the next 20+ years
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-400/15 border border-amber-400/30 p-3.5 text-[14px] text-white leading-relaxed">
                      <span className="font-bold text-gold">Turnkey Guarantee: </span>
                      AG POWER manages DISCOM net-meter approvals, engineering CAD drawings, and subsidy portal processing.
                    </div>
                  </>
                )}

                {/* ── COMMERCIAL & INDUSTRIAL UNIQUE SNAPSHOT ── */}
                {isCommercial && (
                  <>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Bill Offset
                      </p>
                      <p className="font-manrope text-[26px] font-black text-gold leading-tight mt-0.5">
                        Up to 90%
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Substantial reduction in peak demand and grid dependency
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Capital Payback
                      </p>
                      <p className="font-manrope text-[26px] font-black text-white leading-tight mt-0.5">
                        2.5 - 4 Years
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Rapid CapEx recovery on high commercial electricity tariffs
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Tax Benefit
                      </p>
                      <p className="font-manrope text-[20px] font-bold text-white leading-tight mt-0.5">
                        Accelerated Depreciation Eligible
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5 italic">
                        40% tax shield under Section 32 (consult your CA)
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-400/15 border border-amber-400/30 p-3.5 text-[14px] text-white leading-relaxed">
                      <span className="font-bold text-gold">Turnkey Guarantee: </span>
                      AG POWER manages DISCOM net-meter approvals, engineering CAD drawings, and complete C&amp;I commissioning.
                    </div>
                  </>
                )}

                {/* ── HOUSING SOCIETY UNIQUE SNAPSHOT (No 80% vs 90% contradiction) ── */}
                {isSociety && (
                  <>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Common Area Bill Offset
                      </p>
                      <p className="font-manrope text-[26px] font-black text-gold leading-tight mt-0.5">
                        Up to 80%
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Direct offset for lifts, multi-stage water pumps &amp; clubhouses
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 transition-colors hover:bg-white/15">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">
                        Capital Payback
                      </p>
                      <p className="font-manrope text-[26px] font-black text-white leading-tight mt-0.5">
                        3 - 4 Years
                      </p>
                      <p className="text-[14px] text-white/85 mt-0.5">
                        Protects apartment owners against recurring maintenance fee hikes
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-400/15 border border-amber-400/30 p-3.5 text-[14px] text-white leading-relaxed">
                      <span className="font-bold text-gold">Turnkey Guarantee: </span>
                      AG POWER manages DISCOM net-meter approvals, engineering CAD drawings, subsidy portal processing, and RWA/AGM approval support.
                    </div>
                  </>
                )}

                {/* Fallback for any other custom service slugs */}
                {!isResidential && !isCommercial && !isSociety && (
                  <>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">Bill Offset</p>
                      <p className="font-manrope text-[26px] font-black text-gold">Up to 85%</p>
                      <p className="text-[14px] text-white/85">Direct reduction in monthly electrical expenditure</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5">
                      <p className="text-[14px] font-semibold text-cream uppercase tracking-wide">Capital Payback</p>
                      <p className="font-manrope text-[26px] font-black text-white">3 - 4 Years</p>
                      <p className="text-[14px] text-white/85">Free clean energy for the next 20+ years</p>
                    </div>
                    <div className="rounded-xl bg-amber-400/15 border border-amber-400/30 p-3.5 text-[14px] text-white leading-relaxed">
                      <span className="font-bold text-gold">Turnkey Guarantee: </span>
                      AG POWER manages complete end-to-end solar engineering, net-metering liaison, and commissioning.
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Note under snapshot card */}
            <p className="mt-2.5 text-[14px] text-white/85 italic text-center sm:text-left">
              *Actual savings depend on usage, roof area and system size.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
